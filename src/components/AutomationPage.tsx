import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Plus, Edit, Trash2, Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AutomationPage = () => {
  const [automations, setAutomations] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger: { type: "subject_contains", params: {} as { [key: string]: any } },
    action: { type: "move_to_label", params: {} as { [key: string]: any } },
  });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; trigger?: string; action?: string }>({});
  const { toast } = useToast();
  const [editDialog, setEditDialog] = useState<{ open: boolean; automation?: any }>({ open: false });
  const [editAutomation, setEditAutomation] = useState({ name: '', trigger: { type: 'subject_contains', params: {} as { [key: string]: any } }, action: { type: 'move_to_label', params: {} as { [key: string]: any } } });
  const [editFieldErrors, setEditFieldErrors] = useState<{ name?: string; trigger?: string; action?: string }>({});
  const [gmailLabels, setGmailLabels] = useState<string[]>([]);
  const [customLabel, setCustomLabel] = useState("");
  const [editCustomLabel, setEditCustomLabel] = useState("");

  useEffect(() => {
    // Fetch automations from backend on mount
    const fetchAutomations = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/automation', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch automations');
        const data = await response.json();
        // Add default values for UI fields if missing
        setAutomations(
          data.map((automation: any) => ({
            ...automation,
            lastRun: automation.lastRun || 'Never',
            runsToday: automation.runsToday ?? 0,
            successRate: automation.successRate ?? 100,
            isEnabled: automation.isEnabled ?? true,
            status: automation.status || 'active',
          }))
        );
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load automations.',
          variant: 'destructive',
        });
      }
    };
    fetchAutomations();
  }, [toast]);

  useEffect(() => {
    // Fetch Gmail labels for dropdown
    const fetchLabels = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/user/gmail-labels", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch labels");
        const data = await response.json();
        setGmailLabels(data.labels || []);
      } catch (err) {
        setGmailLabels([]);
      }
    };
    fetchLabels();
  }, []);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, isEnabled: !automation.isEnabled, status: automation.isEnabled ? 'paused' : 'active' }
        : automation
    ));
  };

  const handleToggleAutomation = async (id: string, currentEnabled: boolean, currentStatus: string) => {
    const newEnabled = !currentEnabled;
    const newStatus = newEnabled ? 'active' : 'paused';
    try {
      const response = await fetch(`http://localhost:4000/api/automation/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isEnabled: newEnabled, status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update automation status');
      const updated = await response.json();
      setAutomations(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, ...updated } : a));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update automation status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      case "scheduled": return <Clock className="w-4 h-4" />;
      case "error": return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Trigger type options
  const TRIGGER_TYPES = [
    { value: "subject_contains", label: "Subject contains", paramLabel: "Text to match in subject" },
    { value: "from_contains", label: "From contains", paramLabel: "Text to match in sender" },
    { value: "has_attachment", label: "Has attachment", paramLabel: null },
    { value: "calendar_invite", label: "Email contains calendar invitation", paramLabel: null },
    { value: "daily_time", label: "Daily at specific time", paramLabel: "Time (HH:MM, 24h)" },
  ];

  // Action type options
  const ACTION_TYPES = [
    { value: "move_to_label", label: "Move to label", paramLabel: "Label name" },
    { value: "archive", label: "Archive", paramLabel: null },
    { value: "star", label: "Star", paramLabel: null },
    { value: "mark_read", label: "Mark as read", paramLabel: null },
    // { value: "reply", label: "Reply", paramLabel: "Reply message" },
    // { value: "forward", label: "Forward", paramLabel: "Forward to (email)" },
  ];

  // Helper to get trigger description
  function getTriggerDescription(trigger: any) {
    if (!trigger || typeof trigger === 'string') return trigger || '';
    const t = TRIGGER_TYPES.find(t => t.value === trigger.type);
    if (!t) return '';
    switch (trigger.type) {
      case "subject_contains":
        return `Subject contains '${trigger.params?.text || ''}'`;
      case "from_contains":
        return `From contains '${trigger.params?.text || ''}'`;
      case "to_contains":
        return `To contains '${trigger.params?.text || ''}'`;
      case "has_attachment":
        return `Has attachment`;
      case "calendar_invite":
        return `Email contains calendar invitation`;
      case "daily_time":
        return `Daily at ${trigger.params?.time || ''}`;
      default:
        return '';
    }
  }

  function getActionDescription(action: any) {
    if (!action || typeof action === "string") return action || "";
    const a = ACTION_TYPES.find(t => t.value === action.type);
    if (!a) return "";
    switch (action.type) {
      case "move_to_label":
        return `Move to label '${action.params?.label || ""}'`;
      case "archive":
        return "Archive";
      case "star":
        return "Star";
      case "mark_read":
        return "Mark as read";
      case "reply":
        return `Reply: \"${action.params?.message || ""}\"`;
      case "forward":
        return `Forward to ${action.params?.to || ""}`;
      default:
        return "";
    }
  }

  const handleCreateAutomation = async () => {
    const errors: { name?: string; trigger?: string; action?: string } = {};
    if (!newAutomation.name) errors.name = 'Name is required';
    if (!newAutomation.trigger || !newAutomation.trigger.type) errors.trigger = 'Trigger is required';
    if (TRIGGER_TYPES.find(t => t.value === newAutomation.trigger.type)?.paramLabel && !newAutomation.trigger.params?.text && !newAutomation.trigger.params?.time) errors.trigger = 'Trigger parameter is required';
    if (!newAutomation.action || !newAutomation.action.type) errors.action = 'Action is required';
    if (ACTION_TYPES.find(t => t.value === newAutomation.action.type)?.paramLabel) {
      if (
        (newAutomation.action.type === 'move_to_label' && !newAutomation.action.params?.label) ||
        (newAutomation.action.type === 'reply' && !newAutomation.action.params?.message) ||
        (newAutomation.action.type === 'forward' && !newAutomation.action.params?.to)
      ) {
        errors.action = 'Action parameter is required';
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: Object.values(errors).join(' '),
        variant: 'destructive',
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newAutomation.name,
          trigger: newAutomation.trigger,
          action: newAutomation.action,
        })
      });
      if (!response.ok) throw new Error('Failed to save automation');
      const saved = await response.json();
      setAutomations(prev => [
        ...prev,
        {
          ...saved,
          lastRun: 'Never',
          runsToday: 0,
          successRate: 100,
          isEnabled: true,
        }
      ]);
      setShowDialog(false);
      setNewAutomation({ name: '', trigger: { type: 'subject_contains', params: { text: '' } }, action: { type: 'move_to_label', params: { label: '' } } });
      setFieldErrors({});
      toast({
        title: 'Automation created',
        description: 'Your automation has been added successfully.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save automation.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/automation/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete automation');
      setAutomations(prev => prev.filter(a => a.id !== id && a._id !== id));
      toast({
        title: 'Automation deleted',
        description: 'The automation has been removed.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete automation.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (automation: any) => {
    let trigger = automation.trigger;
    if (typeof trigger === 'string') {
      trigger = { type: 'subject_contains', params: { text: trigger } };
    }
    let action = automation.action;
    if (!action || typeof action === 'string') {
      action = { type: 'move_to_label', params: { label: action || '' } };
    }
    setEditAutomation({
      name: automation.name || '',
      trigger: trigger || { type: 'subject_contains', params: { text: '' } },
      action: action || { type: 'move_to_label', params: { label: '' } },
    });
    setEditFieldErrors({});
    setEditDialog({ open: true, automation });
  };

  const handleEditAutomation = async () => {
    const errors: { name?: string; trigger?: string; action?: string } = {};
    if (!editAutomation.name) errors.name = 'Name is required';
    if (!editAutomation.trigger || !editAutomation.trigger.type) errors.trigger = 'Trigger is required';
    if (TRIGGER_TYPES.find(t => t.value === editAutomation.trigger.type)?.paramLabel && !editAutomation.trigger.params?.text && !editAutomation.trigger.params?.time) errors.trigger = 'Trigger parameter is required';
    if (!editAutomation.action || !editAutomation.action.type) errors.action = 'Action is required';
    if (ACTION_TYPES.find(t => t.value === editAutomation.action.type)?.paramLabel) {
      if (
        (editAutomation.action.type === 'move_to_label' && !editAutomation.action.params?.label) ||
        (editAutomation.action.type === 'reply' && !editAutomation.action.params?.message) ||
        (editAutomation.action.type === 'forward' && !editAutomation.action.params?.to)
      ) {
        errors.action = 'Action parameter is required';
      }
    }
    setEditFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast({
        title: 'Validation Error',
        description: Object.values(errors).join(' '),
        variant: 'destructive',
      });
      return;
    }
    try {
      const id = editDialog.automation.id || editDialog.automation._id;
      const response = await fetch(`http://localhost:4000/api/automation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editAutomation.name,
          trigger: editAutomation.trigger,
          action: editAutomation.action,
        })
      });
      if (!response.ok) throw new Error('Failed to update automation');
      const updated = await response.json();
      setAutomations(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, ...updated } : a));
      setEditDialog({ open: false });
      toast({
        title: 'Automation updated',
        description: 'Your automation has been updated successfully.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update automation.',
        variant: 'destructive',
      });
    }
  };

  // Heuristic: 30 seconds saved per successful automation run
  const SECONDS_SAVED_PER_RUN = 30;
  const totalSecondsSaved = automations.reduce(
    (sum, a) => sum + ((a.successCount || 0) * SECONDS_SAVED_PER_RUN),
    0
  );
  const hours = Math.floor(totalSecondsSaved / 3600);
  const minutes = Math.floor((totalSecondsSaved % 3600) / 60);
  const seconds = totalSecondsSaved % 60;
  const timeSavedDisplay =
    hours > 0
      ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
      : minutes > 0
      ? `${minutes}m${seconds > 0 ? ` ${seconds}s` : ''}`
      : `${seconds}s`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Automation</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and manage intelligent email workflows</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Create Automation Modal */}
      <Dialog open={showDialog} onOpenChange={open => {
        setShowDialog(open);
        if (!open) {
          setNewAutomation({ name: '', trigger: { type: 'subject_contains', params: { text: '' } }, action: { type: 'move_to_label', params: { label: '' } } });
          setFieldErrors({});
          setCustomLabel("");
        }
      }}>
        <DialogContent aria-describedby="create-automation-description">
          <DialogHeader>
            <DialogTitle>Create New Automation</DialogTitle>
          </DialogHeader>
          <div id="create-automation-description" className="sr-only">
            Fill out all fields to create a new automation. Name, trigger, and action are required.
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Automation Name"
              value={newAutomation.name}
              onChange={e => setNewAutomation({ ...newAutomation, name: e.target.value })}
            />
            {fieldErrors.name && <div className="text-red-500 text-xs ml-1">{fieldErrors.name}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Trigger Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={newAutomation.trigger.type}
                onChange={e => {
                  const type = e.target.value;
                  let params: any = {};
                  if (type === 'subject_contains' || type === 'from_contains' || type === 'to_contains') params = { text: '' };
                  if (type === 'daily_time') params = { time: '' };
                  setNewAutomation({ ...newAutomation, trigger: { type, params } });
                }}
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {TRIGGER_TYPES.find(t => t.value === newAutomation.trigger.type)?.paramLabel && (
                <Input
                  className="mt-2"
                  placeholder={TRIGGER_TYPES.find(t => t.value === newAutomation.trigger.type)?.paramLabel}
                  value={newAutomation.trigger.params?.time ?? newAutomation.trigger.params?.text ?? ''}
                  onChange={e => {
                    setNewAutomation({
                      ...newAutomation,
                      trigger: {
                        ...newAutomation.trigger,
                        params:
                          newAutomation.trigger.type === 'daily_time'
                            ? { time: e.target.value }
                            : { text: e.target.value }
                      }
                    });
                  }}
                />
              )}
            </div>
            {fieldErrors.trigger && <div className="text-red-500 text-xs ml-1">{fieldErrors.trigger}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Action Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={newAutomation.action.type}
                onChange={e => {
                  const type = e.target.value;
                  let params: any = {};
                  if (type === "move_to_label") params = { label: "" };
                  if (type === "reply") params = { message: "" };
                  if (type === "forward") params = { to: "" };
                  setNewAutomation({ ...newAutomation, action: { type, params } });
                }}
              >
                {ACTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {newAutomation.action.type === "move_to_label" ? (
                <>
                  <select
                    className="w-full border rounded px-2 py-1 mt-2"
                    value={
                      gmailLabels.includes(newAutomation.action.params?.label)
                        ? newAutomation.action.params?.label
                        : newAutomation.action.params?.label === ""
                          ? "__custom__"
                          : newAutomation.action.params?.label === undefined
                          ? "__custom__"
                          : "__custom__"
                    }
                    onChange={e => {
                      if (e.target.value === "__custom__") {
                        setCustomLabel("");
                        setNewAutomation({
                          ...newAutomation,
                          action: {
                            ...newAutomation.action,
                            params: { label: "" },
                          },
                        });
                      } else {
                        setCustomLabel("");
                        setNewAutomation({
                          ...newAutomation,
                          action: {
                            ...newAutomation.action,
                            params: { label: e.target.value },
                          },
                        });
                      }
                    }}
                  >
                    <option value="__custom__">Custom label</option>
                    {gmailLabels.map(label => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                  {newAutomation.action.type === "move_to_label" && newAutomation.action.params?.label === "" && (
                    <Input
                      className="mt-2"
                      placeholder="Custom label name"
                      value={customLabel}
                      onChange={e => {
                        setCustomLabel(e.target.value);
                        setNewAutomation({
                          ...newAutomation,
                          action: {
                            ...newAutomation.action,
                            params: { label: e.target.value },
                          },
                        });
                      }}
                    />
                  )}
                </>
              ) : ACTION_TYPES.find(t => t.value === newAutomation.action.type)?.paramLabel && (
                <Input
                  className="mt-2"
                  placeholder={ACTION_TYPES.find(t => t.value === newAutomation.action.type)?.paramLabel}
                  value={
                    newAutomation.action.type === "reply"
                      ? newAutomation.action.params?.message ?? ""
                      : newAutomation.action.type === "forward"
                      ? newAutomation.action.params?.to ?? ""
                      : ""
                  }
                  onChange={e => {
                    setNewAutomation({
                      ...newAutomation,
                      action: {
                        ...newAutomation.action,
                        params:
                          newAutomation.action.type === "reply"
                            ? { message: e.target.value }
                            : newAutomation.action.type === "forward"
                            ? { to: e.target.value }
                            : {},
                      },
                    });
                  }}
                />
              )}
            </div>
            {fieldErrors.action && <div className="text-red-500 text-xs ml-1">{fieldErrors.action}</div>}
          </div>
          <DialogFooter>
            <Button onClick={handleCreateAutomation}>Create</Button>
            <Button variant="ghost" onClick={() => {
              setShowDialog(false);
              setNewAutomation({ name: '', trigger: { type: 'subject_contains', params: { text: '' } }, action: { type: 'move_to_label', params: { label: '' } } });
              setFieldErrors({});
              setCustomLabel("");
            }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Automation Modal */}
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, automation: editDialog.automation })}>
        <DialogContent aria-describedby="edit-automation-description">
          <DialogHeader>
            <DialogTitle>Edit Automation</DialogTitle>
          </DialogHeader>
          {/* The following div provides a description for accessibility and is referenced by aria-describedby */}
          <p id="edit-automation-description">
            Edit the fields below to update your automation. Name, trigger, and action are required.
          </p>
          <div className="space-y-4">
            <Input
              placeholder="Automation Name"
              value={editAutomation.name}
              onChange={e => setEditAutomation({ ...editAutomation, name: e.target.value })}
            />
            {editFieldErrors.name && <div className="text-red-500 text-xs ml-1">{editFieldErrors.name}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Trigger Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={editAutomation.trigger.type}
                onChange={e => {
                  const type = e.target.value;
                  let params: any = {};
                  if (type === 'subject_contains' || type === 'from_contains' || type === 'to_contains') params = { text: '' };
                  if (type === 'daily_time') params = { time: '' };
                  setEditAutomation({ ...editAutomation, trigger: { type, params } });
                }}
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {TRIGGER_TYPES.find(t => t.value === editAutomation.trigger.type)?.paramLabel && (
                <Input
                  className="mt-2"
                  placeholder={TRIGGER_TYPES.find(t => t.value === editAutomation.trigger.type)?.paramLabel}
                  value={editAutomation.trigger.params?.time ?? editAutomation.trigger.params?.text ?? ''}
                  onChange={e => {
                    setEditAutomation({
                      ...editAutomation,
                      trigger: {
                        ...editAutomation.trigger,
                        params:
                          editAutomation.trigger.type === 'daily_time'
                            ? { time: e.target.value }
                            : { text: e.target.value }
                      }
                    });
                  }}
                />
              )}
            </div>
            {editFieldErrors.trigger && <div className="text-red-500 text-xs ml-1">{editFieldErrors.trigger}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Action Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={editAutomation.action.type}
                onChange={e => {
                  const type = e.target.value;
                  let params: any = {};
                  if (type === "move_to_label") params = { label: "" };
                  if (type === "reply") params = { message: "" };
                  if (type === "forward") params = { to: "" };
                  setEditAutomation({ ...editAutomation, action: { type, params } });
                }}
              >
                {ACTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {editAutomation.action.type === "move_to_label" ? (
                <>
                  <select
                    className="w-full border rounded px-2 py-1 mt-2"
                    value={
                      gmailLabels.includes(editAutomation.action.params?.label)
                        ? editAutomation.action.params?.label
                        : editAutomation.action.params?.label === ""
                          ? "__custom__"
                          : editAutomation.action.params?.label === undefined
                          ? "__custom__"
                          : "__custom__"
                    }
                    onChange={e => {
                      if (e.target.value === "__custom__") {
                        setEditCustomLabel("");
                        setEditAutomation({
                          ...editAutomation,
                          action: {
                            ...editAutomation.action,
                            params: { label: "" },
                          },
                        });
                      } else {
                        setEditCustomLabel("");
                        setEditAutomation({
                          ...editAutomation,
                          action: {
                            ...editAutomation.action,
                            params: { label: e.target.value },
                          },
                        });
                      }
                    }}
                  >
                    <option value="__custom__">Custom label</option>
                    {gmailLabels.map(label => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                  {editAutomation.action.type === "move_to_label" && editAutomation.action.params?.label === "" && (
                    <Input
                      className="mt-2"
                      placeholder="Custom label name"
                      value={editCustomLabel}
                      onChange={e => {
                        setEditCustomLabel(e.target.value);
                        setEditAutomation({
                          ...editAutomation,
                          action: {
                            ...editAutomation.action,
                            params: { label: e.target.value },
                          },
                        });
                      }}
                    />
                  )}
                </>
              ) : ACTION_TYPES.find(t => t.value === editAutomation.action.type)?.paramLabel && (
                <Input
                  className="mt-2"
                  placeholder={ACTION_TYPES.find(t => t.value === editAutomation.action.type)?.paramLabel}
                  value={
                    editAutomation.action.type === "reply"
                      ? editAutomation.action.params?.message ?? ""
                      : editAutomation.action.type === "forward"
                      ? editAutomation.action.params?.to ?? ""
                      : ""
                  }
                  onChange={e => {
                    setEditAutomation({
                      ...editAutomation,
                      action: {
                        ...editAutomation.action,
                        params:
                          editAutomation.action.type === "reply"
                            ? { message: e.target.value }
                            : editAutomation.action.type === "forward"
                            ? { to: e.target.value }
                            : {},
                      },
                    });
                  }}
                />
              )}
            </div>
            {editFieldErrors.action && <div className="text-red-500 text-xs ml-1">{editFieldErrors.action}</div>}
          </div>
          <DialogFooter>
            <Button onClick={handleEditAutomation}>Save</Button>
            <Button variant="ghost" onClick={() => setEditDialog({ open: false })}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold">{automations.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Runs Today</p>
                <p className="text-2xl font-bold">{automations.reduce((sum, a) => sum + a.runsToday, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold">
                  {automations.length === 0 ? 'None' :
                    (() => {
                      const totalSuccess = automations.reduce((sum, a) => sum + (a.successCount || 0), 0);
                      const totalFail = automations.reduce((sum, a) => sum + (a.failureCount || 0), 0);
                      const total = totalSuccess + totalFail;
                      if (total === 0) return 'None';
                      return Math.round((totalSuccess / total) * 100) + '%';
                    })()
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold">{timeSavedDisplay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation List */}
      <div
        className="space-y-4 overflow-y-auto automation-scrollbar scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        style={{ maxHeight: 'calc(50vh + 30but thenpx)', minHeight: '0', transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        {automations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
              No automations to show.
            </CardContent>
          </Card>
        ) : (
          automations.map((automation) => (
            <Card key={automation.id || automation._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 h-144">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Switch
                        checked={automation.isEnabled}
                        onCheckedChange={() => handleToggleAutomation(automation.id || automation._id, automation.isEnabled, automation.status)}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {automation.name}
                      </h3>
                      <Badge className={getStatusColor(automation.status)} size="sm">
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(automation.status)}
                          <span className="capitalize">{automation.status}</span>
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Trigger: </span>
                        <span className="text-gray-600 dark:text-gray-400">{getTriggerDescription(automation.trigger)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Action: </span>
                        <span className="text-gray-600 dark:text-gray-400">{getActionDescription(automation.action)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4 text-xs text-gray-500">
                      <span>Last run: {automation.lastRun ? (automation.lastRun === 'Never' ? 'Never' : new Date(automation.lastRun).toLocaleString()) : 'Never'}</span>
                      <span>Runs today: {typeof automation.runsToday === 'number' ? automation.runsToday : 0}</span>
                      <span>Success rate: {
                        (typeof automation.successCount === 'number' && typeof automation.failureCount === 'number')
                          ? ((automation.successCount + automation.failureCount) === 0
                            ? 'None'
                            : Math.round((automation.successCount / (automation.successCount + automation.failureCount)) * 100) + '%')
                          : 'None'
                      }</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(automation)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Activity className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteAutomation(automation.id || automation._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Templates */}
      <Card className="mt-6 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Quick Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Auto Archive Newsletters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Archive newsletters after 7 days</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Smart Reply Assistant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI generates contextual replies</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Receipt Organizer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto-label and organize receipts</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPage;
