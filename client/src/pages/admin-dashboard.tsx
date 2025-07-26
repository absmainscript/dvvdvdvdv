import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, MessageSquare, HelpCircle, Briefcase, Users, Eye, EyeOff, Edit, Trash2, Plus, LogOut, Home, Palette, Star, GripVertical, Upload, Camera, Image, TrendingUp, Globe, Search, Ban, Target, Brain, Heart, BookOpen, Award, Shield, Sun, Moon, Sparkles, Handshake, MessageCircle, Leaf, Flower, Compass, ChevronUp, ChevronDown, TreePine, Wind, Umbrella, LifeBuoy, Puzzle, Waves, Mountain, Timer, Clock, Activity, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeroColorSettings } from "@/components/admin/HeroColorSettings";
import { SectionColorManager } from "@/components/admin/SectionColorManager";
import type { SiteConfig, Testimonial, FaqItem, Service, PhotoCarousel, Specialty } from "@shared/schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Imports dos componentes que existem
import { HeroImageUpload } from "@/components/admin/HeroImageUpload";
import { TestimonialImageUpload } from "@/components/admin/TestimonialImageUpload";
import { PhotoCarouselImageUpload } from "@/components/admin/PhotoCarouselImageUpload";
import { BasicInfoForm } from "@/components/admin/BasicInfoForm";
import { NavigationForm } from "@/components/admin/NavigationForm";
import { HeroSectionForm } from "@/components/admin/HeroSectionForm";
import { AboutSectionTextsForm } from "@/components/admin/AboutSectionTextsForm";
import { AboutCredentialsManager } from "@/components/admin/AboutCredentialsManager";
import { PhotoCarouselTextsForm } from "@/components/admin/PhotoCarouselTextsForm";
import { PhotoCarouselManager } from "@/components/admin/PhotoCarouselManager";
import { InspirationalSectionForm } from "@/components/admin/InspirationalSectionForm";
import { TestimonialsSectionTextsForm } from "@/components/admin/TestimonialsSectionTextsForm";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { ServicesSectionTextsForm } from "@/components/admin/ServicesSectionTextsForm";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { FaqSectionTextsForm } from "@/components/admin/FaqSectionTextsForm";
import { FaqManager } from "@/components/admin/FaqManager";
import { SchedulingCardForm } from "@/components/admin/SchedulingCardForm";
import { ContactScheduleManager } from "@/components/admin/ContactScheduleManager";
import { FooterManager } from "@/components/admin/FooterManager";
import { SectionVisibilitySettings } from "@/components/admin/SectionVisibilitySettings";
import { MarketingSettings } from "@/components/admin/MarketingSettings";
import { AppearanceSettings } from "@/components/admin/AppearanceSettings";
import { MaintenanceForm } from "@/components/admin/MaintenanceForm";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("general");




  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      setLocation("/09806446909");
    }
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("admin_logged_in");
    setLocation("/09806446909");
  };

  // Queries
  const { data: siteConfigs = [] } = useQuery<SiteConfig[]>({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/config");
      return response.json();
    },
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/testimonials");
      return response.json();
    },
  });

  const { data: faqItems = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/faq");
      return response.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/admin/services"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/services");
      return response.json();
    },
  });

  const { data: photoCarousel = [] } = useQuery<PhotoCarousel[]>({
    queryKey: ["/api/admin/photo-carousel"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/photo-carousel");
      return response.json();
    },
  });

  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["/api/admin/specialties"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/specialties");
      return response.json();
    },
  });

  const { data: contactSettings } = useQuery({
    queryKey: ["/api/admin/contact-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/contact-settings");
      return response.json();
    },
  });

  const { data: footerSettings } = useQuery({
    queryKey: ["/api/admin/footer-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/footer-settings");
      return response.json();
    },
  });



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Painel Admin
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Dra. Adrielle Benhossi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Home className="w-4 h-4 mr-2" />
                  Ver Site
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <Button onClick={logout} variant="destructive" size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <Button onClick={logout} variant="destructive" size="sm" className="sm:hidden">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Banner */}
        {showWelcomeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <div 
              className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-3 sm:p-4 relative touch-pan-x cursor-pointer select-none"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.startX = touch.clientX.toString();
                e.currentTarget.dataset.startY = touch.clientY.toString();
              }}
              onTouchMove={(e) => {
                const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                const startY = parseFloat(e.currentTarget.dataset.startY || '0');
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;

                // Só processar swipe horizontal se for maior que vertical
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                  e.currentTarget.style.transform = `translateX(${deltaX}px)`;
                  e.currentTarget.style.opacity = Math.max(0.3, 1 - Math.abs(deltaX) / 200).toString();
                }
              }}
              onTouchEnd={(e) => {
                const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                const startY = parseFloat(e.currentTarget.dataset.startY || '0');
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // Reset transform primeiro
                e.currentTarget.style.transform = '';
                e.currentTarget.style.opacity = '';

                // Se swipe horizontal for significativo (mais de 80px) e maior que vertical, fechar
                if (Math.abs(deltaX) > 80 && Math.abs(deltaX) > Math.abs(deltaY)) {
                  setShowWelcomeBanner(false);
                }
              }}
            >
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-600 hover:text-gray-800 transition-colors text-xl sm:text-lg font-bold bg-white/70 hover:bg-white/90 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-sm border border-gray-200"
                aria-label="Fechar notificação"
              >
                ×
              </button>
              <div className="pr-8 sm:pr-10">
                <h3 className="font-semibold text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  👋 Bem-vinda, Leleli!
                </h3>
                <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">
                  Aqui você personaliza tudo do seu site! Mexe nos textos, cores, suas fotos, depoimentos dos pacientes, 
                  seus serviços, FAQ e configura os pixels pro Facebook e Google. Toda mudança já fica no ar na hora!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Navegação Unificada - Select Dropdown para Mobile e Desktop */}
            <div className="w-full">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-white border-gray-300 hover:border-purple-400 transition-colors">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {activeTab === "general" && "📋"}
                        {activeTab === "about" && "👩‍⚕️"}
                        {activeTab === "gallery" && "📸"}
                        {activeTab === "specialties" && "🎯"}
                        {activeTab === "testimonials" && "💬"}
                        {activeTab === "services" && "🔧"}
                        {activeTab === "faq" && "❓"}
                        {activeTab === "contact-schedule" && "📞"}
                        {activeTab === "footer" && "🦶"}
                        {activeTab === "visibility" && "👁️"}
                        {activeTab === "marketing" && "📊"}
                        {activeTab === "appearance" && "🎨"}
                      </span>
                      <span className="font-medium">
                        {activeTab === "general" && "Configurações Gerais"}
                        {activeTab === "about" && "Gerenciar Sobre"}
                        {activeTab === "gallery" && "Galeria de Fotos"}
                        {activeTab === "specialties" && "Minhas Especialidades"}
                        {activeTab === "testimonials" && "Gerenciar Depoimentos"}
                        {activeTab === "services" && "Gerenciar Serviços"}
                        {activeTab === "faq" && "Gerenciar FAQ"}
                        {activeTab === "contact-schedule" && "Contato e Horários"}
                        {activeTab === "footer" && "Gerenciar Rodapé"}
                        {activeTab === "visibility" && "Controlar Visibilidade"}
                        {activeTab === "marketing" && "Pixels de Marketing"}
                        {activeTab === "appearance" && "Personalizar Cores"}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Configurações do Site
                    </div>
                    <SelectItem value="general" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📋</span>
                        <div>
                          <div className="font-medium">Configurações Gerais</div>
                          <div className="text-xs text-gray-500">Informações básicas, textos e foto</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="about" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👩‍⚕️</span>
                        <div>
                          <div className="font-medium">Gerenciar Sobre</div>
                          <div className="text-xs text-gray-500">Credenciais e qualificações</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="gallery" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📸</span>
                        <div>
                          <div className="font-medium">Galeria de Fotos</div>
                          <div className="text-xs text-gray-500">Carrossel do consultório</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="specialties" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎯</span>
                        <div>
                          <div className="font-medium">Minhas Especialidades</div>
                          <div className="text-xs text-gray-500">Áreas de atuação</div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Conteúdo
                    </div>
                    <SelectItem value="testimonials" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💬</span>
                        <div>
                          <div className="font-medium">Gerenciar Depoimentos</div>
                          <div className="text-xs text-gray-500">Avaliações de pacientes</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="services" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🔧</span>
                        <div>
                          <div className="font-medium">Gerenciar Serviços</div>
                          <div className="text-xs text-gray-500">Tipos de atendimento e preços</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="faq" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">❓</span>
                        <div>
                          <div className="font-medium">Gerenciar FAQ</div>
                          <div className="text-xs text-gray-500">Perguntas frequentes</div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Contato e Layout
                    </div>
                    <SelectItem value="contact-schedule" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📞</span>
                        <div>
                          <div className="font-medium">Contato e Horários</div>
                          <div className="text-xs text-gray-500">Botões e informações de contato</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="footer" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🦶</span>
                        <div>
                          <div className="font-medium">Gerenciar Rodapé</div>
                          <div className="text-xs text-gray-500">Links e informações finais</div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>

                  <div className="p-2 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                      Configurações Avançadas
                    </div>
                    <SelectItem value="visibility" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👁️</span>
                        <div>
                          <div className="font-medium">Controlar Visibilidade</div>
                          <div className="text-xs text-gray-500">Mostrar/ocultar seções</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="marketing" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📊</span>
                        <div>
                          <div className="font-medium">Pixels de Marketing</div>
                          <div className="text-xs text-gray-500">Facebook, Google Analytics</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="appearance" className="py-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎨</span>
                        <div>
                          <div className="font-medium">Personalizar Cores</div>
                          <div className="text-xs text-gray-500">Temas e paletas de cores</div>
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>
              <div className="grid gap-6">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Informações Básicas
                    </CardTitle>
                    <CardDescription>
                      Configure os dados principais: nome, CRP, descrição e foto de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BasicInfoForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Seção Hero */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🏠</span>
                      Seção Principal (Hero)
                    </CardTitle>
                    <CardDescription>
                      Configure a primeira seção que os visitantes veem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HeroSectionForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Seção Citação Inspiracional */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">💭</span>
                      Citação Inspiracional
                    </CardTitle>
                    <CardDescription>
                      Configure a frase motivacional que aparece na seção inspiracional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InspirationalSectionForm configs={siteConfigs} />
                  </CardContent>
                </Card>



                {/* Navegação */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🧭</span>
                      Menu de Navegação
                    </CardTitle>
                    <CardDescription>
                      Personalize os nomes dos botões do menu (apenas os nomes, as funcionalidades permanecem)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NavigationForm configs={siteConfigs} />
                  </CardContent>
                </Card>

                {/* Modo Manutenção */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <span className="text-lg">🚧</span>
                      Modo de Manutenção
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      Controle se o site fica público ou em manutenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MaintenanceForm configs={siteConfigs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Sobre */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Sobre
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção sobre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AboutSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Credenciais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🎓</span>
                    Gerenciar Credenciais
                  </CardTitle>
                  <CardDescription>
                    Configure as credenciais, qualificações e especializações exibidas na seção "Sobre". 
                    Cada item aparece como um card com gradiente personalizado na seção sobre a psicóloga.
                    Arraste e solte para reordenar a sequência de exibição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AboutCredentialsManager configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              {/* Configurações de Texto da Galeria */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Galeria
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da galeria de fotos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoCarouselTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Fotos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📸</span>
                    Gerenciar Fotos do Carrossel
                  </CardTitle>
                  <CardDescription>
                    Adicione, edite e organize as fotos do consultório. O carrossel avança automaticamente a cada 6 segundos.
                    Arraste e solte para reordenar as fotos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoCarouselManager photoCarousel={photoCarousel} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specialties Tab */}
            <TabsContent value="specialties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Minhas Especialidades</CardTitle>
                  <CardDescription>
                    Configure suas áreas de especialização que aparecem na seção "Sobre". 
                    Defina título, descrição, ícone e cor para cada especialidade.
                    Arraste e solte para reordenar por prioridade.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SpecialtiesManager specialties={specialties} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Depoimentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Depoimentos
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de depoimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialsSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Depoimentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    Gerenciar Depoimentos
                  </CardTitle>
                  <CardDescription>
                    Aqui você adiciona, edita ou remove depoimentos dos seus pacientes. 
                    Use avatares variados para representar diferentes perfis de clientes. 
                    Arraste e solte para reordenar a sequência de exibição no site.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialsManager testimonials={testimonials} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção Serviços
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de serviços
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServicesSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    Gerenciar Serviços
                  </CardTitle>
                  <CardDescription>
                    Configure os serviços que você oferece: título, descrição, ícone e preços. 
                    Escolha entre 40+ ícones profissionais organizados por categorias. 
                    Ative/desative serviços e reordene usando arrastar e soltar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServicesManager services={services} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>

              {/* Configurações de Texto da Seção FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Textos da Seção FAQ
                  </CardTitle>
                  <CardDescription>
                    Configure os textos que aparecem no cabeçalho da seção de FAQ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FaqSectionTextsForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">❓</span>
                    Gerenciar FAQ
                  </CardTitle>
                  <CardDescription>
                    Crie perguntas e respostas frequentes sobre seus serviços. 
                    Ajude seus futuros pacientes esclarecendo dúvidas comuns. 
                    Organize as perguntas arrastando para reordenar por importância.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FaqManager faqItems={faqItems} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visibility Tab */}
            <TabsContent value="visibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visibilidade das Seções</CardTitle>
                  <CardDescription>
                    Controle quais seções do site estão visíveis para os visitantes. 
                    Você pode temporariamente desativar seções durante atualizações ou manutenção.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SectionVisibilitySettings configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="marketing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Marketing</CardTitle>
                  <CardDescription>
                    Configure códigos de acompanhamento para medir visitas e resultados. 
                    Google Analytics mostra estatísticas detalhadas. Facebook Pixel permite criar anúncios direcionados. 
                    Cole os códigos fornecidos por essas plataformas aqui.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketingSettings configs={siteConfigs} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Schedule Tab */}
            <TabsContent value="contact-schedule" className="space-y-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Os campos de texto podem ser redimensionados arrastando o canto inferior direito para aumentar o tamanho.
                </p>
              </div>

              {/* Configurações do Card de Agendamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Card de Agendamento
                  </CardTitle>
                  <CardDescription>
                    Configure os textos do card "Vamos conversar?" que aparece na seção de contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulingCardForm configs={siteConfigs} />
                </CardContent>
              </Card>

              {/* Gerenciamento de Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    Gerenciar Botões e Horários
                  </CardTitle>
                  <CardDescription>
                    Configure botões de contato, horários de funcionamento e localização. 
                    Personalize botões de contato, reordene por prioridade e defina links personalizados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactScheduleManager contactSettings={contactSettings} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footer Tab */}
            <TabsContent value="footer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Rodapé</CardTitle>
                  <CardDescription>
                    Configure todos os elementos do rodapé: textos, botões de contato, certificações, 
                    selos de confiança, informações de copyright e CNPJ. Personalize cores, ícones e ordenação.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FooterManager footerSettings={footerSettings} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="grid gap-6">
                {/* Gerenciador de Cores por Seção */}
                <SectionColorManager configs={siteConfigs} />

                {/* Configurações Globais de Aparência */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cores Globais do Sistema</CardTitle>
                    <CardDescription>
                      Configure as cores principais que afetam botões, links e elementos interativos em todo o site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppearanceSettings configs={siteConfigs} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-400">
            Made with <span className="text-yellow-500">♥</span> by <span className="font-mono">∞</span>
          </div>
        </div>
      </div>
    </div>
  );
}









// Componente arrastável para item de seção
function SortableSectionItem({ section, isVisible, onToggleVisibility }: {
  section: any;
  isVisible: boolean;
  onToggleVisibility: (key: string, visible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`sortable-item flex items-center justify-between p-4 border rounded-lg bg-white ${isDragging ? 'dragging' : ''}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <div 
          {...attributes} 
          {...listeners}
          className="drag-handle p-2 -ml-2"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-2xl">{section.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{section.name}</h3>
            <Badge variant={isVisible ? "default" : "secondary"} className="text-xs">
              {isVisible ? "Visível" : "Oculta"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{section.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => onToggleVisibility(section.key, checked)}
        />
        {isVisible ? (
          <Eye className="w-5 h-5 text-green-600" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );
}





























// Componente de item arrastável para serviços
function SortableServiceItem({ service, onEdit, onDelete }: { 
  service: Service; 
  onEdit: (service: Service) => void; 
  onDelete: (id: number) => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <span className="font-medium">{service.title}</span>
      </TableCell>
      <TableCell>{service.duration}</TableCell>
      <TableCell>{service.price}</TableCell>
      <TableCell>
        <Badge variant={service.isActive ? "default" : "secondary"}>
          {service.isActive ? (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Ativo
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" />
              Inativo
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell>{service.order}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(service.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function SpecialtiesManager({ specialties }: { specialties: Specialty[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<Specialty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sensores otimizados para mobile e desktop
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const specialtySchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    icon: z.string().min(1, "Ícone é obrigatório"),
    iconColor: z.string().min(1, "Cor é obrigatória"),
    isActive: z.boolean(),
    order: z.number().min(0),
  });

  type SpecialtyForm = z.infer<typeof specialtySchema>;

  const form = useForm<SpecialtyForm>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "Brain",
      iconColor: "#ec4899",
      isActive: true,
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SpecialtyForm) => {
      const response = await apiRequest("POST", "/api/admin/specialties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specialties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialties"] });
      toast({ title: "Especialidade criada com sucesso!" });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SpecialtyForm> }) => {
      const response = await apiRequest("PUT", `/api/admin/specialties/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specialties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialties"] });
      toast({ title: "Especialidade atualizada com sucesso!" });
      setEditingItem(null);
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/specialties/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specialties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialties"] });
      toast({ title: "Especialidade excluída com sucesso!" });
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = specialties.findIndex((item) => item.id === active.id);
      const newIndex = specialties.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(specialties, oldIndex, newIndex);

      const updatePromises = newOrder.map((item, index) => 
        apiRequest("PUT", `/api/admin/specialties/${item.id}`, { 
          order: index
        })
      );

      Promise.all(updatePromises).then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/specialties"] });
        queryClient.invalidateQueries({ queryKey: ["/api/specialties"] });
        toast({ title: "Ordem das especialidades atualizada!" });
      }).catch(() => {
        toast({ title: "Erro ao atualizar ordem", variant: "destructive" });
      });
    }
  };

  const onSubmit = (data: SpecialtyForm) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (specialty: Specialty) => {
    setEditingItem(specialty);

    setTimeout(() => {
      form.setValue("title", specialty.title || "");
      form.setValue("description", specialty.description || "");
      form.setValue("icon", specialty.icon || "Brain");
      form.setValue("iconColor", specialty.iconColor || "#ec4899");
      form.setValue("isActive", specialty.isActive ?? true);
      form.setValue("order", specialty.order || 0);
    }, 100);

    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Minhas Especialidades</h3>
          <p className="text-sm text-muted-foreground">
            Configure suas áreas de expertise exibidas na seção "Sobre"
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Especialidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Especialidade" : "Nova Especialidade"}
              </DialogTitle>
              <DialogDescription>
                Configure as informações da sua especialidade
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ansiedade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Técnicas para controlar preocupações excessivas..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ícone</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um ícone" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {/* Ícones de Saúde Mental */}
                              <SelectItem value="Brain"><Brain className="w-4 h-4 mr-2 inline" />Cérebro</SelectItem>
                              <SelectItem value="Heart"><Heart className="w-4 h-4 mr-2 inline" />Coração</SelectItem>
                              <SelectItem value="Shield"><Shield className="w-4 h-4 mr-2 inline" />Escudo/Proteção</SelectItem>
                              <SelectItem value="Target"><Target className="w-4 h-4 mr-2 inline" />Foco/Objetivo</SelectItem>
                              <SelectItem value="Activity"><Activity className="w-4 h-4 mr-2 inline" />Atividade</SelectItem>
                              <SelectItem value="Zap"><Zap className="w-4 h-4 mr-2 inline" />Energia</SelectItem>

                              {/* Ícones de Bem-estar */}
                              <SelectItem value="Sun"><Sun className="w-4 h-4 mr-2 inline" />Sol</SelectItem>
                              <SelectItem value="Moon"><Moon className="w-4 h-4 mr-2 inline" />Lua</SelectItem>
                              <SelectItem value="Star"><Star className="w-4 h-4 mr-2 inline" />Estrela</SelectItem>
                              <SelectItem value="Sparkles"><Sparkles className="w-4 h-4 mr-2 inline" />Brilhos</SelectItem>

                              {/* Ícones de Relacionamento */}
                              <SelectItem value="Users"><Users className="w-4 h-4 mr-2 inline" />Pessoas</SelectItem>
                              <SelectItem value="Handshake"><Handshake className="w-4 h-4 mr-2 inline" />Aperto de Mão</SelectItem>
                              <SelectItem value="MessageCircle"><MessageCircle className="w-4 h-4 mr-2 inline" />Conversa</SelectItem>
                              <SelectItem value="HelpCircle"><HelpCircle className="w-4 h-4 mr-2 inline" />Ajuda</SelectItem>

                              {/* Ícones de Crescimento */}
                              <SelectItem value="TrendingUp"><TrendingUp className="w-4 h-4 mr-2 inline" />Crescimento</SelectItem>
                              <SelectItem value="Award"><Award className="w-4 h-4 mr-2 inline" />Prêmio</SelectItem>
                              <SelectItem value="BookOpen"><BookOpen className="w-4 h-4 mr-2 inline" />Livro</SelectItem>

                              {/* Ícones de Natureza */}
                              <SelectItem value="Leaf"><Leaf className="w-4 h-4 mr-2 inline" />Folha</SelectItem>
                              <SelectItem value="Flower"><Flower className="w-4 h-4 mr-2 inline" />Flor</SelectItem>
                              <SelectItem value="TreePine"><TreePine className="w-4 h-4 mr-2 inline" />Árvore</SelectItem>

                              {/* Ícones de Orientação */}
                              <SelectItem value="Compass"><Compass className="w-4 h-4 mr-2 inline" />Bússola</SelectItem>
                              <SelectItem value="Map"><MapPin className="w-4 h-4 mr-2 inline" />Localização</SelectItem>

                              {/* Ícones de Tempo */}
                              <SelectItem value="Clock"><Clock className="w-4 h-4 mr-2 inline" />Relógio</SelectItem>
                              <SelectItem value="Timer"><Timer className="w-4 h-4 mr-2 inline" />Cronômetro</SelectItem>

                              {/* Ícones Adicionais */}
                              <SelectItem value="Puzzle"><Puzzle className="w-4 h-4 mr-2 inline" />Quebra-cabeça</SelectItem>
                              <SelectItem value="Palette"><Palette className="w-4 h-4 mr-2 inline" />Paleta</SelectItem>
                              <SelectItem value="Waves"><Waves className="w-4 h-4 mr-2 inline" />Ondas</SelectItem>
                              <SelectItem value="Mountain"><Mountain className="w-4 h-4 mr-2 inline" />Montanha</SelectItem>
                              <SelectItem value="Wind"><Wind className="w-4 h-4 mr-2 inline" />Vento</SelectItem>
                              <SelectItem value="Umbrella"><Umbrella className="w-4 h-4 mr-2 inline" />Guarda-chuva</SelectItem>
                              <SelectItem value="LifeBuoy"><LifeBuoy className="w-4 h-4 mr-2 inline" />Boia</SelectItem>
                              <SelectItem value="Home"><Home className="w-4 h-4 mr-2 inline" />Casa</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iconColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do Ícone</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input type="color" className="w-12 h-10" {...field} />
                          </FormControl>
                          <FormControl>
                            <Input placeholder="#ec4899" {...field} />
                          </FormControl>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          O fundo será automaticamente 20% mais suave
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ativo</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Exibir esta especialidade
                            </div>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="text-sm">Prioridade</FormLabel>
                    <div className="flex flex-col sm:flex-row gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                          const currentOrder = form.getValues("order");
                          form.setValue("order", Math.max(0, currentOrder - 1));
                        }}
                      >
                        <ChevronUp className="w-3 h-3" />
                        <span className="hidden sm:inline ml-1">Subir</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                          const currentOrder = form.getValues("order");
                          form.setValue("order", currentOrder + 1);
                        }}
                      >
                        <ChevronDown className="w-3 h-3" />
                        <span className="hidden sm:inline ml-1">Descer</span>
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Ordem: {form.watch("order")}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingItem ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Dica:</strong> Arraste e solte as especialidades para reordenar. A cor do fundo será automaticamente mais suave (20% da cor do ícone).
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={specialties.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {specialties
              .sort((a, b) => a.order - b.order)
              .map((specialty) => (
              <SortableSpecialtyItem 
                key={specialty.id} 
                specialty={specialty}
                onEdit={() => openEditDialog(specialty)}
                onDelete={() => deleteMutation.mutate(specialty.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {specialties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma especialidade cadastrada ainda.</p>
          <p className="text-sm">Clique em "Nova Especialidade" para começar.</p>
        </div>
      )}
    </div>
  );
}

function SortableSpecialtyItem({ specialty, onEdit, onDelete }: { 
  specialty: Specialty; 
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: specialty.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Função para converter cor hex em RGB e depois em tom mais suave
  const getSoftColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const softR = Math.round(r * 0.2 + 255 * 0.8);
    const softG = Math.round(g * 0.2 + 255 * 0.8);
    const softB = Math.round(b * 0.2 + 255 * 0.8);
    return `rgb(${softR}, ${softG}, ${softB})`;
  };

  // Mapeamento de ícones
  const iconMap: Record<string, any> = {
    Brain, Heart, Users, Star, BookOpen, Award, Shield, Sun, Moon, Sparkles, Target,
    Handshake, HelpCircle, MessageCircle, Leaf, Flower, Compass, TrendingUp
  };

  const IconComponent = iconMap[specialty.icon] || Brain;
  const softBgColor = getSoftColor(specialty.iconColor);

  return (
    <Card ref={setNodeRef} style={style} className="p-4 cursor-move">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1 flex-shrink-0">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: softBgColor }}
          >
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: specialty.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-semibold text-sm sm:text-base truncate">{specialty.title}</h4>
              <Badge variant={specialty.isActive ? "default" : "secondary"} className="text-xs flex-shrink-0">
                {specialty.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{specialty.description}</p>
            <p className="text-xs text-gray-400 mt-1">Ordem: {specialty.order}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit} className="h-8 w-8 sm:w-auto p-0 sm:px-3">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Editar</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="h-8 w-8 sm:w-auto p-0 sm:px-3">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Excluir</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}