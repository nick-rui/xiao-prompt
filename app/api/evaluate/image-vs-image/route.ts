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

    if (!files.imageA || !files.imageB) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: 'Both image files (imageA and imageB) are required'
        },
        { status: 400 }
      );
    }

    const promptA = fields.promptA;
    const promptB = fields.promptB;
    const imageAFile = files.imageA;
    const imageBFile = files.imageB;
    const imageAUrl = fileUploadHandler.getFullUrl(imageAFile.publicUrl);
    const imageBUrl = fileUploadHandler.getFullUrl(imageBFile.publicUrl);

    const startTime = Date.now();

    // Compare image similarity using ICT evaluator
    const result = await ictEvaluator.compareImageSimilarity(imageAUrl, imageBUrl);

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      evaluationType: 'image-vs-image',
      results: result,
      metadata: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        images: {
          A: {
            url: imageAUrl,
            filename: imageAFile.originalFilename,
            size: imageAFile.size
          },
          B: {
            url: imageBUrl,
            filename: imageBFile.originalFilename,
            size: imageBFile.size
          }
        },
        prompts: {
          A: promptA,
          B: promptB
        }
      }
    });

  } catch (error) {
    console.error('Image vs Image evaluation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Evaluation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
