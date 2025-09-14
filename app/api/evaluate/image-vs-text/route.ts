import { NextRequest, NextResponse } from 'next/server';
import { ictEvaluator } from '@/lib/ict-evaluator';
import { fileUploadHandler } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    // Parse form data with file upload
    const { fields, files } = await fileUploadHandler.parseFormData(request);
    
    // Validate required fields
    if (!fields.promptA || !fields.promptB) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: 'Both promptA and promptB are required'
        },
        { status: 400 }
      );
    }

    if (!files.image) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: 'Image file is required'
        },
        { status: 400 }
      );
    }

    const promptA = fields.promptA;
    const promptB = fields.promptB;
    const threshold = parseFloat(fields.threshold || '0.7');
    const imageFile = files.image;
    const imageUrl = fileUploadHandler.getFullUrl(imageFile.publicUrl);

    const startTime = Date.now();

    // Initialize ICT evaluator if needed
    await ictEvaluator.initialize();

    // Perform image vs text evaluation using ICT model
    const result = await ictEvaluator.comparePrompts(
      imageUrl,
      promptA,
      promptB,
      threshold
    );

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      evaluationType: 'image-vs-text',
      results: result,
      metadata: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        image: {
          url: imageUrl,
          filename: imageFile.originalFilename,
          size: imageFile.size
        },
        threshold,
        prompts: {
          A: promptA,
          B: promptB
        },
        model: 'ICT (Image-Contained-Text)',
        modelSource: 'https://huggingface.co/8y/ICT'
      }
    });

  } catch (error) {
    console.error('Image vs Text evaluation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Evaluation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
