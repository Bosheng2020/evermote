import {
  defineMemoryProvider,
  type MemoryToolSet,
} from "eve/memory";
import { fileMemory, type FileMemoryOptions } from "eve/memory/file";
import { defineTool, type ToolDefinition } from "eve/tools";
import { always } from "eve/tools/approval";

/**
 * Preserve Eve's bounded file-memory storage and recall semantics while making
 * every model-proposed write visible and individually revocable before it runs.
 */
export function approvalGatedFileMemory(options?: FileMemoryOptions) {
  const provider = fileMemory(options);

  return defineMemoryProvider({
    recall: provider.recall,
    ...(provider.capture ? { capture: provider.capture } : {}),
    async tools(context) {
      const tools = await provider.tools?.(context);
      if (tools === null || tools === undefined) return null;

      return gateFileMemoryTools(tools);
    },
  });
}

export function gateFileMemoryTools(tools: MemoryToolSet): MemoryToolSet {
  const save = tools.save_memory;
  const remove = tools.remove_memory;
  if (!save || !remove) {
    throw new Error("fileMemory() did not expose its expected save/remove tools.");
  }

  return {
    save_memory: defineTool(
      {
        ...save,
        description: `${save.description} The exact text is shown to the user for approval before it is stored.`,
        // Preserve fileMemory's replayable executor and schema descriptors.
        // Re-wrapping either callback here would make the dynamic memory tool
        // impossible to reconstruct after approval parks the workflow.
        approval: always(),
      } as unknown as ToolDefinition,
    ),
    remove_memory: defineTool(
      {
        ...remove,
        description: `${remove.description} The exact memory index is shown to the user for approval before it is removed.`,
        approval: always(),
      } as unknown as ToolDefinition,
    ),
  };
}
