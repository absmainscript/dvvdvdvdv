
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SiteConfig } from "@shared/schema";

interface AboutSectionTextsFormProps {
  configs: SiteConfig[];
}

export function AboutSectionTextsForm({ configs }: AboutSectionTextsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aboutSchema = z.object({
    badge: z.string().min(1, "Badge é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().min(1, "Subtítulo é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type AboutTextsForm = z.infer<typeof aboutSchema>;

  const getAboutData = () => {
    const aboutSection = configs?.find(c => c.key === 'about_section')?.value as any || {};
    
    return {
      badge: aboutSection.badge || "SOBRE MIM",
      title: aboutSection.title || "Sobre Mim",
      subtitle: aboutSection.subtitle || "Psicóloga dedicada ao seu bem-estar",
      description: aboutSection.description || "Com experiência em terapia cognitivo-comportamental, ofereço um espaço seguro e acolhedor para você trabalhar suas questões emocionais e desenvolver ferramentas para uma vida mais equilibrada.",
    };
  };

  const form = useForm<AboutTextsForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: getAboutData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getAboutData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: AboutTextsForm) => {
      await apiRequest("POST", "/api/admin/config", {
        key: "about_section",
        value: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Textos da seção Sobre atualizados com sucesso!" });
    },
  });

  const onSubmit = (data: AboutTextsForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800">
          🎨 Use (palavra) para aplicar cores degradê automáticas nos títulos. Exemplo: "Sobre (Mim)"
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge da Seção</FormLabel>
                <FormControl>
                  <Input placeholder="SOBRE MIM" {...field} />
                </FormControl>
                <FormDescription>
                  Pequeno texto em destaque acima do título principal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Seção Sobre ()</FormLabel>
                <FormControl>
                  <Input placeholder="Sobre Mim" {...field} />
                </FormControl>
                <FormDescription>
                  Título principal da seção. Use (palavra) para efeito degradê. Ex: "Sobre (Mim)"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo da Seção</FormLabel>
                <FormControl>
                  <Input placeholder="Psicóloga dedicada ao seu bem-estar" {...field} />
                </FormControl>
                <FormDescription>
                  Subtítulo explicativo que aparece abaixo do título
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Principal</FormLabel>
                <FormControl>
                  <Textarea placeholder="Com experiência em terapia cognitivo-comportamental..." rows={4} {...field} />
                </FormControl>
                <FormDescription>
                  Descrição detalhada sobre sua experiência e abordagem profissional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar Textos da Seção Sobre"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
