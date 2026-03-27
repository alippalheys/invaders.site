import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { supabase } from "../supabase";

const DEFAULT_SIZE_GUIDE = {
  adult: [
    { size: 'XS', chest: '34"', length: '26"', shoulder: '16"' },
    { size: 'S', chest: '36"', length: '27"', shoulder: '17"' },
    { size: 'M', chest: '38"', length: '28"', shoulder: '18"' },
    { size: 'L', chest: '40"', length: '29"', shoulder: '19"' },
    { size: 'XL', chest: '42"', length: '30"', shoulder: '20"' },
    { size: 'XXL', chest: '44"', length: '31"', shoulder: '21"' },
  ],
  kids: [
    { size: '4', chest: '22"', length: '16"', age: '3-4' },
    { size: '6', chest: '24"', length: '18"', age: '5-6' },
    { size: '8', chest: '26"', length: '20"', age: '7-8' },
    { size: '10', chest: '28"', length: '22"', age: '9-10' },
    { size: '12', chest: '30"', length: '24"', age: '11-12' },
    { size: '14', chest: '32"', length: '25"', age: '13-14' },
  ],
};

export const settingsRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    try {
      console.log("[Settings] Fetching settings...");
      
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "bank_transfer_info")
        .single();

      if (error || !data) {
        console.log("[Settings] No settings found, returning defaults");
        return {
          bankName: "Bank of Maldives (BML)",
          accountName: "Club Invaders",
          accountNumber: "7730000123456",
        };
      }

      console.log("[Settings] Successfully fetched settings");
      return data.value as {
        bankName: string;
        accountName: string;
        accountNumber: string;
      };
    } catch (error) {
      console.error("[Settings] Query failed:", error);
      return {
        bankName: "Bank of Maldives (BML)",
        accountName: "Club Invaders",
        accountNumber: "7730000123456",
      };
    }
  }),

  getSizeGuide: publicProcedure.query(async () => {
    try {
      console.log("[Settings] Fetching size guide...");
      
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "size_guide")
        .single();

      if (error || !data) {
        console.log("[Settings] No size guide found, returning defaults");
        return DEFAULT_SIZE_GUIDE;
      }

      console.log("[Settings] Successfully fetched size guide");
      return data.value as typeof DEFAULT_SIZE_GUIDE;
    } catch (error) {
      console.error("[Settings] Size guide query failed:", error);
      return DEFAULT_SIZE_GUIDE;
    }
  }),

  updateSizeGuide: publicProcedure
    .input(
      z.object({
        adult: z.array(z.object({
          size: z.string(),
          chest: z.string(),
          length: z.string(),
          shoulder: z.string(),
        })),
        kids: z.array(z.object({
          size: z.string(),
          chest: z.string(),
          length: z.string(),
          age: z.string(),
        })),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("[Settings] Updating size guide:", JSON.stringify(input));
        
        const existingResult = await supabase
          .from("settings")
          .select("*")
          .eq("key", "size_guide")
          .single();

        if (existingResult.data) {
          const updateResult = await supabase
            .from("settings")
            .update({ value: input })
            .eq("key", "size_guide")
            .select()
            .single();

          if (updateResult.error) {
            console.error("[Settings] Error updating size guide:", updateResult.error.message);
            throw new Error(updateResult.error.message);
          }

          return input;
        } else {
          const insertResult = await supabase
            .from("settings")
            .insert({ key: "size_guide", value: input })
            .select()
            .single();

          if (insertResult.error) {
            console.error("[Settings] Error creating size guide:", insertResult.error.message);
            throw new Error(insertResult.error.message);
          }

          return input;
        }
      } catch (error: any) {
        console.error("[Settings] Size guide update failed:", error);
        throw new Error(error.message || 'Failed to update size guide');
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        bankName: z.string(),
        accountName: z.string(),
        accountNumber: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("[Settings] Updating bank info:", JSON.stringify(input));
        
        const existingResult = await supabase
          .from("settings")
          .select("*")
          .eq("key", "bank_transfer_info")
          .single();

        console.log("[Settings] Existing check:", JSON.stringify(existingResult));

        if (existingResult.data) {
          const updateResult = await supabase
            .from("settings")
            .update({ value: input })
            .eq("key", "bank_transfer_info")
            .select()
            .single();

          console.log("[Settings] Update result:", JSON.stringify(updateResult));

          if (updateResult.error) {
            console.error("[Settings] Error updating settings:", updateResult.error.message);
            throw new Error(updateResult.error.message);
          }

          if (!updateResult.data) {
            console.error("[Settings] No data returned from update");
            throw new Error('No data returned from update');
          }

          return input;
        } else {
          const insertResult = await supabase
            .from("settings")
            .insert({ key: "bank_transfer_info", value: input })
            .select()
            .single();

          console.log("[Settings] Insert result:", JSON.stringify(insertResult));

          if (insertResult.error) {
            console.error("[Settings] Error creating settings:", insertResult.error.message);
            throw new Error(insertResult.error.message);
          }

          if (!insertResult.data) {
            console.error("[Settings] No data returned from insert");
            throw new Error('No data returned from insert');
          }

          return input;
        }
      } catch (error: any) {
        console.error("[Settings] Update mutation failed:", error);
        throw new Error(error.message || 'Failed to update bank information');
      }
    }),
});
