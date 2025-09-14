# Prompt Evaluation Guide

This guide explains how to use the evaluation features in the Prompt Optimization Dashboard to compare verbose prompts with optimized Chinese prompts.

## Overview

The dashboard provides two evaluation scenarios:

1. **Image vs Image**: Generate images with both prompts using Gemini and compare the visual results
2. **Image vs Text**: Use the ICT (Image-Contained-Text) model to evaluate text-image alignment without generating new images

## Evaluation Scenarios

### 1. Image vs Image Evaluation

This evaluation uses Google's Gemini API to:
- Generate images from the same base image using both prompts
- Compare the generated images for similarity, quality, and prompt adherence
- Provide detailed analysis and recommendations

**Use Case**: When you want to see actual visual differences between prompt results.

**Requirements**:
- Gemini API key (set `GEMINI_API_KEY` environment variable)
- Base image file (uploaded directly, supports JPG, PNG, WebP, etc.)
- Two prompts to compare

**Metrics**:
- **Similarity**: How similar the generated image is to the original
- **Visual Quality**: Overall quality of the generated image
- **Prompt Adherence**: How well the image follows the prompt instructions
- **Overall Score**: Weighted combination of all metrics

### 2. Image vs Text Evaluation (ICT)

This evaluation uses the ICT (Image-Contained-Text) model from Hugging Face to:
- Evaluate text-image alignment using threshold-based scoring
- Compare how well each prompt describes or relates to the image
- Provide alignment scores without generating new images

**Use Case**: When you want to evaluate prompt-image alignment quickly without image generation.

**Requirements**:
- Image file (uploaded directly, supports JPG, PNG, WebP, etc.)
- Two prompts to compare
- Optional: ICT threshold (default: 0.7)

**Metrics**:
- **ICT Alignment Score**: Threshold-based alignment score (0-100%)
- **Confidence**: Model confidence in the evaluation
- **Alignment Level**: High/Medium/Low classification
- **Text-Image Similarity**: Raw similarity before threshold application

## ICT Model Information

The ICT (Image-Contained-Text) model addresses limitations in traditional text-image alignment evaluation:

- **Threshold-Based Evaluation**: Uses `C(I,P) = min(CLIP(I,P) / θ, 1)` instead of direct similarity
- **High-Quality Image Friendly**: Doesn't penalize images with rich visual details
- **Human Preference Aligned**: Trained on hierarchical preference triplets

**Model Source**: [https://huggingface.co/8y/ICT](https://huggingface.co/8y/ICT)

**Paper**: "Enhancing Reward Models for High-quality Image Generation: Beyond Text-Image Alignment"

## API Endpoints

### Image vs Image Evaluation

```bash
POST /api/evaluate/image-vs-image
Content-Type: multipart/form-data

# Form fields:
baseImage: <image file>
promptA: "Add a beautiful moon and twinkling stars to the night sky"
promptB: "添加月亮和星星"
focusOnSimilarity: "true"
focusOnQuality: "true"
focusOnPromptAdherence: "true"
```

### Image vs Text Evaluation

```bash
POST /api/evaluate/image-vs-text
Content-Type: multipart/form-data

# Form fields:
image: <image file>
promptA: "Add a beautiful moon and twinkling stars to the night sky"
promptB: "添加月亮和星星"
threshold: "0.7"
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pnpm install @google/generative-ai @huggingface/transformers sharp canvas formidable @types/formidable
   ```

2. **Set Environment Variables**:
   ```bash
   # For Image vs Image evaluation
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Other existing variables
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   # ... etc
   ```

3. **Access the Evaluation Interface**:
   - Navigate to the "Evaluation" tab in the dashboard
   - Or visit `/evaluation` directly

## Usage Tips

1. **Image Files**: Upload images directly from your device. Supports common formats (JPG, PNG, WebP, GIF) up to 10MB

2. **Prompt Comparison**: 
   - Use Prompt A for verbose English descriptions
   - Use Prompt B for optimized Chinese prompts

3. **ICT Threshold**: 
   - Lower values (0.3-0.5): More lenient evaluation
   - Higher values (0.7-0.9): Stricter evaluation
   - Default 0.7 works well for most cases

4. **Interpretation**:
   - **Tie results**: Both prompts perform similarly
   - **Score differences < 5%**: Minimal practical difference
   - **Score differences > 10%**: Significant performance gap

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**:
   - Set the `GEMINI_API_KEY` environment variable
   - Restart the development server

2. **"ICT Evaluator initialization failed"**:
   - Ensure transformers dependencies are installed
   - Check internet connection for model downloads

3. **"Image file is required"**:
   - Make sure to select and upload an image file
   - Check that the file is a valid image format
   - Ensure file size is under 10MB

4. **Slow evaluation times**:
   - ICT evaluation: ~2-5 seconds (model loading on first use)
   - Image vs Image: ~10-30 seconds (includes image generation)

### Performance Notes

- ICT model downloads on first use (~500MB)
- Subsequent evaluations are faster due to model caching
- Image generation times vary based on Gemini API response times

## Example Workflow

1. **Prepare Test Data**:
   - Select an image file from your device
   - Create a verbose English prompt
   - Generate optimized Chinese prompt using the main playground

2. **Run Evaluations**:
   - Test both evaluation types
   - Compare results and metrics
   - Analyze recommendations

3. **Iterate**:
   - Adjust prompts based on evaluation feedback
   - Re-run evaluations to measure improvements
   - Document successful prompt patterns

This evaluation system helps validate that prompt optimization maintains or improves output quality while reducing token usage and costs.
