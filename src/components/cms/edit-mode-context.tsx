"use client";

/**
 * Edit-mode + Selection contexts.
 *
 * Primitives call `useEditMode()` to decide whether to render the
 * editable surface. On public pages there's no provider — the default
 * value returns `editMode: false`, so primitives render a plain
 * read-only element with zero admin coupling.
 *
 * `useSelection()` exposes a single selected path (path into content.json)
 * that Phase 4's hover toolbar will consume. Nothing reads it yet.
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// ------------------------ Edit mode ------------------------

interface EditModeContextValue {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

const EditModeContext = createContext<EditModeContextValue>({
  editMode: false,
  setEditMode: () => {},
});

export function EditModeProvider({
  children,
  initial = false,
}: {
  children: React.ReactNode;
  initial?: boolean;
}) {
  const [editMode, setEditMode] = useState<boolean>(initial);
  const value = useMemo(() => ({ editMode, setEditMode }), [editMode]);
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode(): EditModeContextValue {
  return useContext(EditModeContext);
}

// ------------------------ Selection ------------------------

interface SelectionContextValue {
  selectedPath: string | null;
  setSelectedPath: Dispatch<SetStateAction<string | null>>;
}

const SelectionContext = createContext<SelectionContextValue>({
  selectedPath: null,
  setSelectedPath: () => {},
});

export function SelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const value = useMemo(
    () => ({ selectedPath, setSelectedPath }),
    [selectedPath]
  );
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionContextValue {
  return useContext(SelectionContext);
}
