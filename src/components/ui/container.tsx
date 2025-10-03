import * as React from "react";

interface ContainerProps {
  children?: React.ReactNode
}

export const Container = ({children}: ContainerProps) => {
  return (
    <div className={'max-w-[1464px] w-full mx-auto px-3'}>
      {children}
    </div>
  );
};