<script setup lang="ts">
import { ref } from "vue";
import { CreditCardIcon, WalletIcon, Building2Icon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

const paymentMethod = ref("card");
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :as-child="true">
      <Button variant="outline"> Payment Method </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel
          >Select Payment Method</DropdownMenuLabel
        >
        <DropdownMenuRadioGroup
          v-model="paymentMethod"
        >
          <DropdownMenuRadioItem value="card">
            <CreditCardIcon />
            Credit Card
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="paypal"
          >
            <WalletIcon />
            PayPal
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bank">
            <Building2Icon />
            Bank Transfer
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>