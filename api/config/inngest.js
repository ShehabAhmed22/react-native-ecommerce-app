import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/User.js";

export const inngest = new Inngest({ id: "ecommerce-app" });

// ─── Sync User Function ───────────────────────────────
export const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: { event: "clerk/user.created" }, // ← الحدث هنا
  },
  async ({ event }) => {
    // ← هذا هو handler
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}` || "User",
      imageUrl: image_url,
      addresses: [],
      wishlist: [],
    };

    await User.create(newUser);
  },
);

// ─── Delete User Function ─────────────────────────────
export const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: { event: "clerk/user.deleted" }, // ← الحدث هنا
  },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  },
);

export const functions = [syncUser, deleteUserFromDB];
