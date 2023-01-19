import * as z from "zod";

const usernameSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/);

export default function validateUserInput(username: string): {
  res: boolean;
  err: string;
} {
  try {
    usernameSchema.parse(username);
    return { res: true, err: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      return { res: false, err: error.message };
    }
  }
  return { res: true, err: "" };
}
