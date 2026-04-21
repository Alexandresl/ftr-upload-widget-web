import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, useCycle } from 'motion/react';
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";

export function UploadWidget() {
  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true);

  return (
    // Em volta de todo o componente - Collapsible.ROOT
    <Collapsible.Root onOpenChange={() => toggleWidgetOpen()}>
      <motion.div
        className="bg-zinc-900 w-[360px] rounded-xl shadow-shape overflow-hidden"
        animate={isWidgetOpen ? 'open' : 'closed'}
        variants={{
          closed: {
            width: 'max-content',
            height: 44,
            transition: {
              type: 'tween',
              duration: 0.1
            }
          },
          open: {
            width: 420,
            height: 'auto',
            transition: {
              duration: 0.1
            }
          }
        }}
      >
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}
        {/* Em volta do elemento completo - Collapsible content */}
        <Collapsible.Content>
          <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />
            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />
            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  );
}
