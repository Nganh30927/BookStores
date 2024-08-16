import { create } from "zustand";

import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSaveOrderId = create(
  devtools(
    persist(
      (set: any, get: any) => ({
        orderId: "",
        saveOrderId: async (id: number) => {
          return set(
            {
              orderId: id,
            },
            false,
            {
              type: "order/saveOrderId",
            }
          );
        },
      }),

      {
        name: "orderId-storage", // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);
