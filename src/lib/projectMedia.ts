import mintstars from "@/assets/project-mintstars.jpg";
import eventapp from "@/assets/project-eventapp.jpg";
import pulse from "@/assets/project-pulse.jpg";
import sonic from "@/assets/project-sonic.jpg";

const byFileName: Record<string, string> = {
  "project-mintstars.jpg": mintstars,
  "project-eventapp.jpg": eventapp,
  "project-pulse.jpg": pulse,
  "project-sonic.jpg": sonic,
};

/** Resolves `src/assets` imports by basename, or returns absolute/relative URLs unchanged. */
export function resolveProjectMedia(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("/")) return ref;
  return byFileName[ref] ?? ref;
}
