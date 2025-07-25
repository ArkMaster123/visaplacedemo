"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Info, 
  Zap,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HALOSettings {
  enabled: boolean;
  customPrompt: string;
  autoReview: boolean;
  showEmotions: boolean;
}

const DEFAULT_HALO_PROMPT = `You are HALO (Human-AI Learning Orchestrator), an advanced AI system specialized in analyzing expertise capture conversations and providing actionable insights.

Your role is to:
1. **Analyze Conversation Quality**: Evaluate how well expertise was captured during the voice interaction
2. **Emotional Intelligence**: Review emotional patterns and their impact on knowledge sharing
3. **Knowledge Gaps**: Identify areas that need deeper exploration
4. **Optimization Recommendations**: Suggest improvements for better expertise elicitation
5. **Next Steps**: Provide clear, actionable next steps for the user

When reviewing conversations, focus on:
- Quality of questions asked and responses given
- Emotional engagement and comfort levels
- Depth of expertise captured vs. potential missed opportunities
- Patterns in communication that enhance or hinder knowledge sharing
- Practical recommendations for improving the process

Provide your analysis in a structured format with:
- **Overall Assessment** (1-5 stars)
- **Key Insights** (bullet points)
- **Emotional Analysis** (based on detected emotions)
- **Knowledge Gaps** (what wasn't captured)
- **Recommendations** (3-5 actionable items)
- **Next Steps** (immediate actions to take)

Be constructive, insightful, and focused on helping users improve their expertise capture process.`;

export default function HALOSettings({
  onSettingsChange
}: {
  onSettingsChange: (settings: HALOSettings) => void;
}) {
  const [settings, setSettings] = useState<HALOSettings>({
    enabled: true,
    customPrompt: DEFAULT_HALO_PROMPT,
    autoReview: false,
    showEmotions: true
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('halo-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onSettingsChange(parsed);
      } catch (error) {
        console.error('Failed to load HALO settings:', error);
      }
    } else {
      // Save default settings
      localStorage.setItem('halo-settings', JSON.stringify(settings));
      onSettingsChange(settings);
    }
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('halo-settings', JSON.stringify(settings));
      onSettingsChange(settings);
      toast.success("HALO settings saved successfully!");
      
      // Close dialog after successful save
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    const defaultSettings = {
      enabled: true,
      customPrompt: DEFAULT_HALO_PROMPT,
      autoReview: false,
      showEmotions: true
    };
    setSettings(defaultSettings);
    toast.info("Settings reset to default");
  };

  const updateSetting = <K extends keyof HALOSettings>(
    key: K, 
    value: HALOSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 hover-lift transition-modern"
        >
          <Settings className="h-4 w-4" />
          HALO Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-gradient-primary">HALO Configuration</span>
            </div>
            <Badge variant={settings.enabled ? "default" : "secondary"}>
              {settings.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-base">
            Configure HALO (Human-AI Learning Orchestrator) settings for expertise capture analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Settings */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Core Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Enable/Disable HALO */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="halo-enabled" className="text-base font-medium">
                    Enable HALO Review
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on HALO analysis for conversation review and insights
                  </p>
                </div>
                <Switch
                  id="halo-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => updateSetting('enabled', checked)}
                />
              </div>

              {/* Auto Review */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-review" className="text-base font-medium">
                    Auto Review
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically trigger HALO review after conversations
                  </p>
                </div>
                <Switch
                  id="auto-review"
                  checked={settings.autoReview}
                  onCheckedChange={(checked) => updateSetting('autoReview', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {/* Show Emotions */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-emotions" className="text-base font-medium">
                    Emotion Analysis
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Include emotion data in HALO reviews
                  </p>
                </div>
                <Switch
                  id="show-emotions"
                  checked={settings.showEmotions}
                  onCheckedChange={(checked) => updateSetting('showEmotions', checked)}
                  disabled={!settings.enabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* HALO Prompt Configuration */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                HALO Prompt Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Custom HALO Prompt
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Customize how HALO analyzes and reviews conversations
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center gap-2"
                >
                  {showPrompt ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPrompt ? 'Hide' : 'Show'} Prompt
                </Button>
              </div>

              {showPrompt && (
                <div className="space-y-3">
                  <Textarea
                    value={settings.customPrompt}
                    onChange={(e) => updateSetting('customPrompt', e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter your custom HALO prompt..."
                    disabled={!settings.enabled}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetToDefault}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset to Default
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>{settings.customPrompt.length} characters</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Settings are saved to your browser's local storage
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 