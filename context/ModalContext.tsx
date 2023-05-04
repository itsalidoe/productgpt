import { createContext, PropsWithChildren, useState } from "react";

export interface IModalContext {
  modalContext: {
    [key: string]: boolean;
  };
  setModalContext: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

export const ModalContext = createContext<IModalContext | null>(null);
export const ModalProvider = (props: PropsWithChildren) => {
  const [modalContext, setModalContext] = useState<
    IModalContext["modalContext"]
  >({
    welcome: false,
  });
  return (
    <ModalContext.Provider value={{ modalContext, setModalContext }}>
      {props.children}
    </ModalContext.Provider>
  );
};
