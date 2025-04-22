"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { delete_product } from "@/store/products/product-thunk";
const ConfirmAlert = ({
  product_id,
  triggerTxt,
  triggerStyle,
  message,
  btnTxt,
  btnStyle,
}) => {
  const { isLoading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(delete_product(product_id));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={triggerStyle}>
        {triggerTxt}
      </AlertDialogTrigger>
      <AlertDialogContent className="md:!w-[30vw]">
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
          {/* <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className={btnStyle}
          >
            {btnTxt}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlert;
