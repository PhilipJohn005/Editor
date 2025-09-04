import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CertificateSetup = () => {
  const [width, setWidth] = useState(595);
  const [height, setHeight] = useState(842);
  const navigate = useNavigate();

  const handleStart = async (w: number, h: number) => {
    let text = 'Custom';
    if (w === 595 && h === 842) text = 'A4 portrait';
    else if (w === 842 && h === 595) text = 'A4 landscape';

    // For now, we'll use a mock certificate ID since we don't have the backend
    // In a real implementation, you'd create the certificate via API
    const mockCertId = `cert_${Date.now()}`;

    navigate('/certificate-editor', {
      state: {
        width: w,
        height: h,
        certId: mockCertId,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Certificate</CardTitle>
          <p className="text-muted-foreground">Set up your certificate canvas dimensions</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 595)}
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 842)}
                className="text-center"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleStart(width, height)}
              className="w-full"
              size="lg"
            >
              Create Custom Canvas
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleStart(595, 842)}
                variant="outline"
                className="w-full"
              >
                A4 Portrait
              </Button>
              <Button
                onClick={() => handleStart(842, 595)}
                variant="outline"
                className="w-full"
              >
                A4 Landscape
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateSetup;