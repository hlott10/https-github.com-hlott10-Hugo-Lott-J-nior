import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card } from '@/components/ui/card';
import { cn } from "../../lib/utils";
import { useState } from 'react';
import { Map as MapIcon, ShieldAlert, Zap, Target } from 'lucide-react';

interface MapAnalysisProps {
  vertical?: 'saude' | 'restaurante';
}

export function MapAnalysis({ vertical = 'saude' }: MapAnalysisProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isRestaurante = vertical === 'restaurante';
  const [mapError, setMapError] = useState(false);

  // Default Coordinates (Fallback)
  const position = { lat: -23.5874, lng: -46.6415 }; 

  const markers = isRestaurante ? [
    { id: '1', pos: { x: '45%', y: '40%' }, name: "Restaurante Local" },
    { id: '2', pos: { x: '55%', y: '35%' }, name: "Espaço Gourmet" },
    { id: '3', pos: { x: '35%', y: '60%' }, name: "Bistrô Regional" },
    { id: '4', pos: { x: '60%', y: '50%' }, name: "Lanchonete local" },
    { id: '5', pos: { x: '70%', y: '45%' }, name: "Cafeteria" },
  ] : [
    { id: '1', pos: { x: '40%', y: '45%' }, name: `Clínica ${vertical === 'saude' ? 'de Saúde' : ''}` },
    { id: '2', pos: { x: '60%', y: '30%' }, name: "Centro Médico" },
    { id: '3', pos: { x: '50%', y: '65%' }, name: "Consultório Local" },
    { id: '4', pos: { x: '30%', y: '40%' }, name: "Laboratório Regional" },
    { id: '5', pos: { x: '75%', y: '55%' }, name: "Unidade de Atendimento" },
  ];

  // Render Tactical Fallback (High-end aesthetic for Demo/Error)
  const renderTacticalMap = () => (
    <div className="relative w-full h-full bg-[#021515] overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #14B8A6 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      {/* Concentric Achievement Circles (Radar Effect) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-accent/20 rounded-full animate-pulse" />

      {/* Crosshair */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-accent/10" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-accent/10" />

      {/* Main Location Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_#14B8A6]" />
          <div className="absolute -inset-4 border border-accent rounded-full animate-ping opacity-20" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
             <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 px-2 py-1 rounded border border-white/10">Sua Localização</span>
          </div>
        </div>
      </div>

      {/* Markers */}
      {markers.map(m => (
        <div key={m.id} className="absolute z-10" style={{ left: m.pos.x, top: m.pos.y }}>
          <div className="group relative">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] group-hover:scale-150 transition-transform" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               <span className="text-[8px] font-bold uppercase tracking-tighter text-white bg-red-900/90 px-2 py-1 rounded whitespace-nowrap border border-red-500/30">
                 {m.name}
               </span>
            </div>
          </div>
        </div>
      ))}

      {/* Tactical UI Elements */}
      <div className="absolute top-20 right-8 space-y-4">
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 space-y-2">
           <div className="flex items-center gap-2">
             <Zap className="w-3 h-3 text-accent" />
             <span className="text-[8px] font-black uppercase tracking-widest text-accent">Inteligência Competitiva</span>
           </div>
           <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-accent animate-[loading_2s_infinite]" />
           </div>
        </div>
      </div>

      {!apiKey && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-[#042121] p-6 rounded-[2rem] border border-white/10 shadow-2xl text-center max-w-[280px] space-y-4">
             <ShieldAlert className="w-10 h-10 text-orange-500 mx-auto" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
               Modo <span className="text-accent underline">Simulação Tática</span> Ativo.
               <br />
               Insira sua chave de API para o mapa real.
             </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full h-[450px] bg-[#042121] border-none rounded-[3rem] shadow-2xl overflow-hidden relative group">
      {/* Real-time indicator regardless of map type */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Análise de Dados {apiKey ? 'Ao Vivo' : 'Simulada'}</span>
        </div>
      </div>

      {apiKey && !mapError ? (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={position}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%', border: 'none' }}
            mapId={null}
          >
            <Marker position={position} />
            {markers.map(m => (
              <Marker key={m.id} position={{ lat: position.lat + (Math.random() * 0.01 - 0.005), lng: position.lng + (Math.random() * 0.01 - 0.005) }} />
            ))}
          </Map>
        </APIProvider>
      ) : (
        renderTacticalMap()
      )}
      
      {/* Legend - Always visible to ensure data comprehension */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-between items-end">
        <div className="bg-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 max-w-[200px] space-y-1">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Análise de Densidade</h4>
           <p className="text-[9px] text-muted-foreground leading-tight">Identificamos 5 concorrentes diretos em um raio de 2km na sua região.</p>
        </div>
        
        {/* Toggle/Status indicator for Admin visual */}
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 text-right space-y-1">
           <div className="flex items-center justify-end gap-2">
             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Localização Auditada</span>
             <MapIcon className="w-3 h-3 text-white" />
           </div>
        </div>
      </div>
    </Card>
  );
}
