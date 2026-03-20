"use client";

import { useState, useSyncExternalStore } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getApiUrl, setApiUrl, clearApiUrl, apiRequest } from "@/lib/api/client";
import { useTheme } from "next-themes";
import { useAppSettings } from "@/lib/hooks/use-app-settings";
import { Sun, Moon, Monitor, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { settings, updateSettings } = useAppSettings();

  const [url, setUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return getApiUrl() ?? "";
  });
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Local state for credit card settings (save on button click)
  const [cibilThreshold, setCibilThreshold] = useState<string>("");
  const [dueDaysWarning, setDueDaysWarning] = useState<string>("");
  const [emiDaysReminder, setEmiDaysReminder] = useState<string>("");

  const testConnection = async () => {
    if (!url.trim()) return;
    setStatus("testing");
    setStatusMessage("");
    try {
      setApiUrl(url.trim());
      await apiRequest("ping");
      setStatus("ok");
      setStatusMessage("Connected successfully");
    } catch (err) {
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Connection failed");
      clearApiUrl();
    }
  };

  const saveUrl = () => {
    if (url.trim()) {
      setApiUrl(url.trim());
      testConnection();
    }
  };

  const saveCreditCardSettings = () => {
    const threshold = parseInt(cibilThreshold) || settings.creditCards.cibilWarningThreshold;
    const dueDays = parseInt(dueDaysWarning) || settings.creditCards.daysBeforeDueWarning;
    updateSettings({
      creditCards: { cibilWarningThreshold: threshold, daysBeforeDueWarning: dueDays },
    });
    setCibilThreshold("");
    setDueDaysWarning("");
  };

  const saveLoanSettings = () => {
    const emiDays = parseInt(emiDaysReminder) || settings.loans.daysBeforeEmiReminder;
    updateSettings({ loans: { daysBeforeEmiReminder: emiDays } });
    setEmiDaysReminder("");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div>
      <Header title="Settings" description="Configure your finance manager" />

      <div className="max-w-2xl space-y-6 p-6">
        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            {mounted && (
              <div className="flex gap-2">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <Button
                      key={opt.value}
                      variant={theme === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme(opt.value)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display</CardTitle>
            <CardDescription>Currency and date format preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currencyFormat">Currency Format</Label>
                <select
                  id="currencyFormat"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={settings.display.currencyFormat}
                  onChange={(e) =>
                    updateSettings({
                      display: {
                        ...settings.display,
                        currencyFormat: e.target.value as "full" | "compact",
                      },
                    })
                  }
                >
                  <option value="full">Full (₹1,00,000)</option>
                  <option value="compact">Compact (₹1L)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select
                  id="dateFormat"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={settings.display.dateFormat}
                  onChange={(e) =>
                    updateSettings({
                      display: {
                        ...settings.display,
                        dateFormat: e.target.value as "dmy" | "mdy",
                      },
                    })
                  }
                >
                  <option value="dmy">DD/MM/YYYY (Indian)</option>
                  <option value="mdy">MM/DD/YYYY</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credit Card Settings</CardTitle>
            <CardDescription>Fine-tune alerts and thresholds for credit card tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cibilThreshold">
                  CIBIL Warning Threshold (%)
                </Label>
                <Input
                  id="cibilThreshold"
                  type="number"
                  min={1}
                  max={100}
                  placeholder={String(settings.creditCards.cibilWarningThreshold)}
                  value={cibilThreshold}
                  onChange={(e) => setCibilThreshold(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {settings.creditCards.cibilWarningThreshold}%
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDaysWarning">
                  Due Date Warning (days before)
                </Label>
                <Input
                  id="dueDaysWarning"
                  type="number"
                  min={1}
                  max={30}
                  placeholder={String(settings.creditCards.daysBeforeDueWarning)}
                  value={dueDaysWarning}
                  onChange={(e) => setDueDaysWarning(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {settings.creditCards.daysBeforeDueWarning} days
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={saveCreditCardSettings}>
                Save Credit Card Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loan Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loan Settings</CardTitle>
            <CardDescription>Configure EMI reminder preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emiReminder">
                EMI Reminder (days before due)
              </Label>
              <Input
                id="emiReminder"
                type="number"
                min={1}
                max={14}
                placeholder={String(settings.loans.daysBeforeEmiReminder)}
                value={emiDaysReminder}
                onChange={(e) => setEmiDaysReminder(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Current: {settings.loans.daysBeforeEmiReminder} days
              </p>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={saveLoanSettings}>
                Save Loan Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Google Apps Script API</CardTitle>
            <CardDescription>
              Connect to your Google Sheets backend. Deploy your Apps Script as a
              Web App and paste the URL below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">Web App URL</Label>
              <div className="flex gap-2">
                <Input
                  id="apiUrl"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={saveUrl} disabled={!url.trim()}>
                  Save
                </Button>
              </div>
            </div>

            {/* Connection status */}
            {status !== "idle" && (
              <div className="flex items-center gap-2">
                {status === "testing" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {status === "ok" && <Check className="h-4 w-4 text-green-500" />}
                {status === "error" && <X className="h-4 w-4 text-destructive" />}
                <span
                  className={cn(
                    "text-sm",
                    status === "ok" && "text-green-500",
                    status === "error" && "text-destructive",
                    status === "testing" && "text-muted-foreground"
                  )}
                >
                  {status === "testing" ? "Testing connection..." : statusMessage}
                </span>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Setup Guide</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create a new Google Sheet</li>
                <li>Go to Extensions &rarr; Apps Script</li>
                <li>
                  Paste the code from{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    apps-script/Code.gs
                  </code>{" "}
                  in the repo
                </li>
                <li>Click Deploy &rarr; New Deployment &rarr; Web App</li>
                <li>Set &quot;Execute as&quot; to &quot;Me&quot; and &quot;Access&quot; to &quot;Anyone&quot;</li>
                <li>Copy the Web App URL and paste it above</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
