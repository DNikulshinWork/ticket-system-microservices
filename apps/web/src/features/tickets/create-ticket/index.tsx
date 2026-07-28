"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateTicket } from "../use-create-ticket";
import { Loader2 } from "lucide-react";

const ticketSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(100),
  description: z.string().min(10, "Минимум 10 символов").max(1000),
  authorId: z.string().min(1, "ID автора обязателен"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function CreateTicketForm() {
  const { mutate: createTicket, isPending, isSuccess, error } = useCreateTicket();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { title: "", description: "", authorId: "user-123" },
  });

  const onSubmit = (data: TicketFormValues) => {
    createTicket(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Создать новый тикет</CardTitle>
        <CardDescription>Опишите проблему, система обработает её через Kafka</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input id="title" placeholder="Например: Не работает вход" {...register("title")} disabled={isPending} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" placeholder="Подробно опишите проблему..." rows={5} {...register("description")} disabled={isPending} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorId">ID Автора</Label>
            <Input id="authorId" {...register("authorId")} disabled={isPending} />
            {errors.authorId && <p className="text-sm text-red-500">{errors.authorId.message}</p>}
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">Ошибка: {error.message}</div>}
          {isSuccess && <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">✅ Тикет успешно создан!</div>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отправка...</> : "Создать тикет"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}