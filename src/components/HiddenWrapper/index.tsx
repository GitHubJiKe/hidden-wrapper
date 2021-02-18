import React from "react";

interface IHiddenWrapperProps {
  hidde: boolean;
  children: React.ReactNode;
  showPlaceholder?: boolean;
  placeholder?: React.ReactNode;
}

export default function HiddenWrapper({
  hidde,
  children,
  showPlaceholder = false,
  placeholder,
}: IHiddenWrapperProps) {
  return hidde ? showPlaceholder ? <>{placeholder}</> : null : <>{children}</>;
}
