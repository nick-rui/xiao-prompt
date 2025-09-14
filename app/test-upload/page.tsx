'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [preview2, setPreview2] = useState<string | null>(null)
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
    
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFile2(selectedFile || null)
    
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview2(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview2(null)
    }
  }

  const testImageVsText = async () => {
    if (!file) return

    setLoading(true)
    setResponse(null)

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Hardcoded response
      const data = {
        success: true,
        evaluationType: 'image-vs-text',
        results: {
          promptA: {
            score: 0.92,
            confidence: 0.88,
            alignment: 'high'
          },
          promptB: {
            score: 0.89,
            confidence: 0.91,
            alignment: 'high'
          }
        }
      }
      setResponse(data)
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testImageVsImage = async () => {
    if (!file || !file2) return

    setLoading(true)
    setResponse(null)

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Hardcoded response
      const data = {
        success: true,
        evaluationType: 'image-vs-image',
        results: {
          similarity: 0.94,
          confidence: 0.96,
          qualityMaintained: true,
          recommendation: 'Very good quality maintenance - minor differences detected'
        }
      }
      setResponse(data)
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testFile">Upload Test Image</Label>
            <Input
              id="testFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div>
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              {preview && (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="mt-2 max-w-md max-h-64 rounded-md border object-cover"
                />
              )}
            </div>
          )}

          <div>
            <Label htmlFor="testFile2">Upload Second Image (for Image vs Image test)</Label>
            <Input
              id="testFile2"
              type="file"
              accept="image/*"
              onChange={handleFile2Change}
            />
          </div>

          {file2 && (
            <div>
              <p className="text-sm text-muted-foreground">
                Selected: {file2.name} ({(file2.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              {preview2 && (
                <img 
                  src={preview2} 
                  alt="Preview 2" 
                  className="mt-2 max-w-md max-h-64 rounded-md border object-cover"
                />
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={testImageVsText} 
              disabled={!file || loading}
              variant="outline"
            >
              Test Image vs Text
            </Button>
            <Button 
              onClick={testImageVsImage} 
              disabled={!file || !file2 || loading}
              variant="outline"
            >
              Test Image vs Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API Response
              <Badge variant={response.success ? "default" : "destructive"}>
                {response.success ? "Success" : "Error"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
