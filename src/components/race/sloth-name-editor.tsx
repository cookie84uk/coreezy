'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SlothNameEditorProps {
  address: string;
  currentName: string | null;
  onNameChange?: (name: string) => void;
}

export function SlothNameEditor({ address, currentName, onNameChange }: SlothNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const debouncedName = useDebounce(name, 500);

  // Check name availability when typing
  const checkAvailability = useCallback(async (nameToCheck: string) => {
    if (!nameToCheck || nameToCheck === currentName) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`/api/race/profile/name?check=${encodeURIComponent(nameToCheck)}`);
      const data = await response.json();

      if (data.available) {
        setIsAvailable(true);
        setError(null);
      } else {
        setIsAvailable(false);
        setError(data.error || 'Name not available');
      }
    } catch {
      setError('Failed to check availability');
    } finally {
      setIsChecking(false);
    }
  }, [currentName]);

  useEffect(() => {
    if (debouncedName && isEditing) {
      checkAvailability(debouncedName);
    }
  }, [debouncedName, isEditing, checkAvailability]);

  const handleSave = async () => {
    if (!name.trim() || name === currentName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/race/profile/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, name: name.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onNameChange?.(data.name);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to save name');
      }
    } catch {
      setError('Failed to save name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(currentName || '');
    setIsEditing(false);
    setError(null);
    setIsAvailable(null);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="group flex items-center gap-2 hover:text-canopy-400 transition-colors"
      >
        <span className="text-2xl font-bold text-coreezy-100">
          {currentName || 'Unnamed Sloth'}
        </span>
        <Pencil className="w-4 h-4 text-coreezy-500 group-hover:text-canopy-400 transition-colors" />
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsAvailable(null);
            }}
            placeholder="Enter sloth name"
            maxLength={20}
            autoFocus
            className={`w-full bg-coreezy-800/50 border rounded-lg px-3 py-2 text-coreezy-100 placeholder:text-coreezy-600 focus:outline-none ${
              error
                ? 'border-red-500 focus:border-red-500'
                : isAvailable
                ? 'border-canopy-500 focus:border-canopy-500'
                : 'border-coreezy-700 focus:border-canopy-500'
            }`}
          />
          {/* Status indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking && <Loader2 className="w-4 h-4 text-coreezy-500 animate-spin" />}
            {!isChecking && isAvailable === true && <Check className="w-4 h-4 text-canopy-400" />}
            {!isChecking && isAvailable === false && <AlertCircle className="w-4 h-4 text-red-400" />}
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving || isChecking || isAvailable === false || !name.trim()}
          className="p-2 rounded-lg bg-canopy-600 hover:bg-canopy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Check className="w-5 h-5 text-white" />
          )}
        </button>
        
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="p-2 rounded-lg bg-coreezy-700 hover:bg-coreezy-600 transition-colors"
        >
          <X className="w-5 h-5 text-coreezy-300" />
        </button>
      </div>
      
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      
      <p className="text-xs text-coreezy-500">
        2-20 characters, letters, numbers, spaces, underscores, hyphens only
      </p>
    </div>
  );
}
