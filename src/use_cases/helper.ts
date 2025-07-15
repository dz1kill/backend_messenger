import { z } from "zod";

export const newGroupSchema = z.object({
  groupId: z.string().uuid(),
  groupName: z.string(),
});
