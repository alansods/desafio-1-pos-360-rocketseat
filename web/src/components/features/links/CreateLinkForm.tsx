import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Warning, CircleNotch } from "phosphor-react";
import { createLinkSchema, CreateLinkSchema } from "../../../types/link";
import { useLinks } from "../../../hooks/useLinks";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";

export function CreateLinkForm() {
  const { createLink } = useLinks();
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkSchema>({
    resolver: zodResolver(createLinkSchema),
  });

  const isLoading = createLink.isPending;

  const onSubmit = (data: CreateLinkSchema) => {
    createLink.mutate(data, {
      onSuccess: () => {
        reset();
        toast.success("Link criado com sucesso!");
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Erro ao criar link";
        const friendlyMessage =
          message === "Duplicated code"
            ? "Este link encurtado já existe. Por favor, escolha outro código."
            : message;

        setErrorModal({ isOpen: true, message: friendlyMessage });
      },
    });
  };

  return (
    <div className="bg-white rounded-lg p-8 space-y-6">
      <h2 className="text-lg font-bold text-gray-600">Novo link</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Link Original"
          placeholder="www.exemplo.com.br"
          error={errors.url?.message}
          {...register("url")}
        />

        <div className="space-y-2">
          <label
            className={twMerge("input-label", errors.code && "text-danger")}
          >
            Link Encurtado
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm text-gray-400 font-medium select-none">
              brev.ly/
            </span>
            <input
              className={twMerge(
                errors.code ? "input-error" : "input-default",
                "pl-[3.7rem]"
              )}
              placeholder="exemplo"
              {...register("code")}
            />
          </div>
          {errors.code && (
            <div className="input-error-message">
              <Warning size={16} className="text-danger" weight="fill" />
              <span>{errors.code.message}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <CircleNotch size={20} className="animate-spin" />
              Salvando...
            </span>
          ) : (
            "Salvar link"
          )}
        </Button>
      </form>

      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="Erro ao criar link"
        description={errorModal.message}
        footer={
          <Button onClick={() => setErrorModal({ isOpen: false, message: "" })}>
            OK
          </Button>
        }
      />
    </div>
  );
}
