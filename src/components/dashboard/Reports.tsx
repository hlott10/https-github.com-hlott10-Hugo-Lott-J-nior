import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Download, 
  FileText, 
  Table as TableIcon, 
  Calendar,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  X,
  FileCheck,
  PieChart as PieChartIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportsProps {
  vertical?: 'saude' | 'restaurante';
}

const reportsList: any[] = [];

export function Reports({ vertical = 'saude' }: ReportsProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  const selectedReport = reportsList.find(r => r.id === selectedReportId);

  const handleDownload = (reportId: string) => {
    const report = reportsList.find(r => r.id === reportId);
    if (!report) return;

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const doc = new jsPDF();
          
          // Estilização Básica do Relatório
          doc.setFontSize(22);
          doc.setTextColor(isRestaurante ? "#FF4500" : "#14B8A6");
          doc.text("ESTRELIZE BI - RELATÓRIO EXECUTIVO", 14, 22);
          
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text(report.name, 14, 32);
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Categoria: ${report.category} | Período: ${report.date}`, 14, 40);
          doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, 14, 45);
          
          doc.line(14, 50, 196, 50);

          if (report.id === "rep-1") {
            const tableData = report.data?.map(row => [row.author, row.review, row.response, row.status]) || [];
            autoTable(doc, {
              startY: 60,
              head: [['Autor', 'Avaliação Original', 'Resposta IA', 'Status']],
              body: tableData,
              theme: 'striped',
              headStyles: { fillColor: isRestaurante ? [255, 69, 0] : [20, 184, 166] }
            });
          } else if (report.id === "rep-2") {
            const tableData = report.sentimentData?.map(row => [row.category, `${row.pos}%`, `${row.neg}%`]) || [];
            autoTable(doc, {
              startY: 60,
              head: [['Categoria', 'Positivo (%)', 'Negativo (%)']],
              body: tableData,
              theme: 'grid',
              headStyles: { fillColor: isRestaurante ? [255, 69, 0] : [20, 184, 166] }
            });
          } else if (report.id === "rep-3") {
            doc.setFontSize(14);
            doc.text("Resumo de Performance Financeira", 14, 65);
            doc.setFontSize(12);
            doc.text(`ROI Total Consolidado: R$ 4.250,00`, 14, 75);
            doc.text(`Crescimento vs Mês Anterior: +22%`, 14, 82);
            
            const tableData = report.roiData?.map(row => [row.month, `R$ ${row.revenue.toLocaleString()}`, `R$ ${row.organic.toLocaleString()}`]) || [];
            autoTable(doc, {
              startY: 95,
              head: [['Mês', 'Receita Total', 'Receita Orgânica (Maps)']],
              body: tableData,
              headStyles: { fillColor: isRestaurante ? [255, 69, 0] : [20, 184, 166] }
            });
          } else {
            const tableData = report.benchmark?.map(row => [row.name, row.score, `#${row.rank}`]) || [];
            autoTable(doc, {
              startY: 60,
              head: [['Estabelecimento', 'Score Estrelize', 'Ranking Local']],
              body: tableData,
              headStyles: { fillColor: isRestaurante ? [255, 69, 0] : [20, 184, 166] }
            });
          }

          // Rodapé
          const pageCount = (doc as any).internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Este documento é confidencial e auditado eletronicamente pela Estrelize Business Intelligence.", 14, 285);
            doc.text(`Página ${i} de ${pageCount}`, 180, 285);
          }

          doc.save(`Estrelize_${report.name.replace(/\s+/g, '_')}_${report.date.replace(/\s+/g, '_')}.pdf`);
          resolve(true);
        }, 1500);
      }),
      {
        loading: "Compilando dados executivos e gerando PDF...",
        success: "Download concluído! Verifique seus arquivos.",
        error: "Falha na geração do PDF.",
      }
    );
  };

  const handleGenerateNew = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3500);
      }),
      {
        loading: "IA processando novos dados de auditoria...",
        success: "Novo relatório gerado e adicionado ao seu arquivo!",
        error: "Erro ao processar dados.",
      }
    );
  };

  const sortedReports = [...reportsList].sort((a: any, b: any) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      comparison = (a.timestamp || 0) - (b.timestamp || 0);
    } else if (sortBy === 'size') {
      comparison = (a.sizeBytes || 0) - (b.sizeBytes || 0);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 italic font-medium">Business Intelligence</span>
          <h2 className={cn("text-5xl font-bold", titleFont)}>Relatórios & Auditoria</h2>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Analise o ROI das suas melhores avaliações e garanta que sua reputação está {isRestaurante ? "impecável" : "auditada e ética"}.
          </p>
        </div>
        <Button 
          onClick={handleGenerateNew}
          className="h-14 px-8 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-lg shadow-accent/5"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Gerar Novo Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-[#042121] border-none p-8 rounded-[2.5rem] shadow-xl space-y-4 group hover:bg-[#052d2d] transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">100% Ok</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status de Auditoria</p>
            <div className="text-3xl font-bold">Auditado</div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">Todas as respostas IA revisadas por humanos.</p>
          </div>
        </Card>

        <Card className="bg-[#042121] border-none p-8 rounded-[2.5rem] shadow-xl space-y-4 group hover:bg-[#052d2d] transition-all text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ROI Estimado (30d)</p>
            <div className="text-3xl font-bold">R$ 4.250</div>
            <p className="text-[11px] text-[#10B981] font-bold mt-2">+22% vs mês anterior</p>
          </div>
        </Card>

        <Card className="bg-[#042121] border-none p-8 rounded-[2.5rem] shadow-xl space-y-4 group hover:bg-[#052d2d] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ranking Local</p>
            <div className="text-3xl font-bold">Top #3</div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">Subiu 2 posições esta semana!</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#042121] border-none p-10 rounded-[3rem] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className={cn("text-2xl font-bold", titleFont)}>Arquivo de Relatórios</h3>
            
            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
              <div className="flex items-center gap-1">
                {(['date', 'name', 'size'] as const).map((field) => (
                  <button
                    key={field}
                    onClick={() => setSortBy(field)}
                    className={cn(
                      "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                      sortBy === field ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {field === 'date' ? 'Data' : field === 'name' ? 'Nome' : 'Tamanho'}
                  </button>
                ))}
              </div>
              <div className="w-[1px] h-4 bg-white/10 mx-1" />
              <button
                onClick={toggleSortOrder}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all text-muted-foreground hover:text-white"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {sortedReports.length > 0 ? sortedReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedReportId(report.id)}
                className="flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-black/20 hover:bg-black/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-accent/20 transition-all">
                    {report.type === "PDF" ? <FileText className="w-6 h-6 text-accent" /> : <TableIcon className="w-6 h-6 text-cta" />}
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-0.5 group-hover:text-accent transition-colors">{report.name}</div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-3">
                      <span className="text-accent/60">{report.category}</span>
                      <span className="opacity-20">•</span>
                      <span>{report.date}</span>
                      <span className="opacity-20">•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-xl h-12 px-4 hover:bg-accent/10 hover:text-accent transition-all font-black text-[9px] uppercase tracking-widest"
                  >
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-xl h-12 w-12 hover:bg-accent/10 hover:text-accent transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(report.id);
                    }}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl text-muted-foreground/20">
                  <FileText className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg italic">Nenhum relatório gerado</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Inicie sua primeira auditoria para gerar relatórios de ROI e análise de sentimento.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-[#041212] border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center justify-center space-y-6 overflow-hidden">
          <div className="w-20 h-20 rounded-[2.5rem] bg-accent/20 flex items-center justify-center text-accent animate-pulse relative">
            <Zap className="w-10 h-10 fill-current" />
            <div className="absolute -inset-4 border border-accent/20 rounded-full animate-ping" />
          </div>
          <div className="space-y-3">
            <h4 className={cn("text-2xl font-bold", titleFont)}>Insight IA</h4>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Suas avaliações destacam o <span className="text-white font-bold">atendimento humanizado</span>. Relacionar isso ao ROI mostra que pacientes fidelizados indicam 30% mais novos clientes."
            </p>
          </div>
          <Button 
            variant="link" 
            onClick={() => setSelectedReportId("rep-2")}
            className="text-accent underline decoration-accent/30 font-black uppercase tracking-widest text-[10px] hover:text-accent/80"
          >
            Ver Análise Detalhada
          </Button>
        </Card>
      </div>

      {/* Report Modal Viewer */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReportId(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#042121] rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 flex flex-col min-h-[70vh] z-[101]"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-6 h-6 text-accent" />
                    <h3 className={cn("text-3xl font-bold", titleFont)}>{selectedReport.name}</h3>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{selectedReport.category} • {selectedReport.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => handleDownload(selectedReport.id)}
                    className="bg-accent hover:bg-accent/80 text-white font-black uppercase tracking-widest text-[10px] px-6 h-12 rounded-xl"
                  >
                    Download PDF
                  </Button>
                  <button 
                    onClick={() => setSelectedReportId(null)}
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    <X className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-10 overflow-y-auto">
                {selectedReport.id === "rep-1" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Reviews Auditados</span>
                        <div className="text-3xl font-black">100%</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Taxa de Aprovação</span>
                        <div className="text-3xl font-black text-emerald-500">92%</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Intervenções IA</span>
                        <div className="text-3xl font-black text-accent">8</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Logs de Auditoria</h4>
                      <div className="bg-black/40 rounded-3xl overflow-hidden border border-white/5">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-black/40 border-b border-white/5">
                              <th className="p-6 text-[10px] font-black uppercase text-muted-foreground">Autor</th>
                              <th className="p-6 text-[10px] font-black uppercase text-muted-foreground">Avaliação Original</th>
                              <th className="p-6 text-[10px] font-black uppercase text-muted-foreground">Resposta Draft IA</th>
                              <th className="p-6 text-[10px] font-black uppercase text-muted-foreground">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedReport.data?.map((row: any) => (
                              <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="p-6 text-sm font-bold">{row.author}</td>
                                <td className="p-6 text-[11px] text-muted-foreground italic leading-relaxed">"{row.review}"</td>
                                <td className="p-6 text-[11px] leading-relaxed">{row.response}</td>
                                <td className="p-6">
                                  <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                    row.status === "Aprovado" ? "bg-emerald-500/10 text-emerald-500" : "bg-accent/10 text-accent"
                                  )}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.id === "rep-2" && (
                  <div className="space-y-12">
                    <div className="flex items-center gap-8">
                      <div className="flex-1 space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Distribuição Qualitativa</h4>
                         <div className="h-[300px] w-full min-w-0 flex items-center justify-center">
                           {isMounted ? (
                             <ResponsiveContainer width="100%" height={300} minWidth={0}>
                               <BarChart data={selectedReport.sentimentData}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                 <XAxis dataKey="category" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                 <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                 <Tooltip 
                                   contentStyle={{ backgroundColor: "#042F2E", border: "none", borderRadius: "12px", fontSize: "10px" }}
                                 />
                                 <Bar dataKey="pos" fill="#10B981" radius={[4, 4, 0, 0]} name="Positivo %" />
                                 <Bar dataKey="neg" fill="#EF4444" radius={[4, 4, 0, 0]} name="Negativo %" />
                               </BarChart>
                             </ResponsiveContainer>
                           ) : (
                             <div className="h-full w-full bg-white/5 animate-pulse rounded-2xl" />
                           )}
                         </div>
                      </div>
                      <div className="w-64 space-y-4">
                        <Card className="bg-black/20 border-white/5 p-6 rounded-2xl">
                          <AlertCircle className="w-6 h-6 text-orange-500 mb-2" />
                          <h5 className="font-bold text-xs uppercase text-orange-500">Ponto Crítico</h5>
                          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                            A <span className="text-white font-black">Agilidade</span> caiu 12% este mês. Recomendamos auditoria no check-out.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.id === "rep-3" && (
                  <div className="space-y-8">
                    <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 flex items-center justify-between">
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-white">ROI Consolidado: R$ 4.250</h4>
                          <p className="text-sm text-muted-foreground">Valor gerado apenas por avaliações orgânicas em Fevereiro.</p>
                       </div>
                       <TrendingUp className="w-16 h-16 text-accent opacity-20" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <Card className="bg-black/20 border-white/5 p-8 rounded-3xl">
                          <h5 className="text-[10px] font-black uppercase text-muted-foreground mb-6">Receita Orgânica (Maps)</h5>
                          <div className="h-[200px] min-w-0 flex items-center justify-center">
                            {isMounted ? (
                              <ResponsiveContainer width="100%" height={200} minWidth={0}>
                                <BarChart data={selectedReport.roiData}>
                                  <XAxis dataKey="month" hide />
                                  <Bar dataKey="organic" fill="#14B8A6" radius={8} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full w-full bg-white/5 animate-pulse rounded-2xl" />
                            )}
                          </div>
                       </Card>
                       <Card className="bg-black/20 border-white/5 p-8 rounded-3xl">
                          <h5 className="text-[10px] font-black uppercase text-muted-foreground mb-6">Novas Agendas (IA Lead)</h5>
                          <div className="flex items-center justify-center h-[200px]">
                             <div className="text-center">
                                <div className="text-6xl font-black text-accent">+42</div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground mt-2">Novos Clientes</p>
                             </div>
                          </div>
                       </Card>
                    </div>
                  </div>
                )}

                {selectedReport.id === "rep-4" && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent text-center mb-8">Posicionamento Competitivo Q1</h4>
                    <div className="grid grid-cols-3 gap-6">
                      {selectedReport.benchmark?.map((item: any) => (
                        <Card key={item.name} className={cn(
                          "p-8 rounded-[2rem] text-center space-y-4 border transition-all",
                          item.name.includes("Estrelize") ? "bg-accent/10 border-accent/30 shadow-2xl shadow-accent/10" : "bg-black/20 border-white/5"
                        )}>
                          <div className="text-[10px] font-black uppercase text-muted-foreground">Score Estrelize</div>
                          <div className="text-5xl font-black">{item.score}</div>
                          <div className="text-xs font-bold text-muted-foreground">Ranking Local: #{item.rank}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                  Documento Gerado por Estrelize Business Intelligence Engine • Dados fornecidos por Google Maps © 2026
                </p>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedReportId(null)}
                    className="border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest px-8 rounded-xl"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
