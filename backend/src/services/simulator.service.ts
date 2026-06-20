// src/services/simulator.service.ts
import { prisma } from '../server';

export const simulateConflict = async (
  worldId: string,
  factionA_Id: string,
  factionB_Id: string,
  scale: "VILLAGE" | "CITY" | "REGION" | "CONTINENT" | "PLANETARY",
  intensity: number
) => {
  // 1. Determinar vencedor com lógica mais inteligente
  const roll = Math.random() * 10;
  const winnerId = roll > 5 ? factionA_Id : factionB_Id;
  const loserId = winnerId === factionA_Id ? factionB_Id : factionA_Id;

  // Buscar nomes e dados das facções
  const winner = await prisma.kingdom.findUnique({ where: { id: winnerId } }) || 
                 await prisma.location.findUnique({ where: { id: winnerId } });
  const loser = await prisma.kingdom.findUnique({ where: { id: loserId } }) || 
                await prisma.location.findUnique({ where: { id: loserId } });

  const winnerName = winner?.name || "Fação A";
  const loserName = loser?.name || "Fação B";

  // Calcular severidade baseada na intensidade
  const severity = intensity >= 8 ? "Devastador" : intensity >= 5 ? "Moderado" : "Menor";
  const duration = intensity >= 8 ? "Anos" : intensity >= 5 ? "Meses" : "Semanas";

  // 2. Criar o Evento Principal com mais detalhes
  const mainEvent = await prisma.event.create({
    data: {
      worldId,
      name: `A Guerra de ${loserName}: O Conflito de ${scale}`,
      description: `Um confronto de intensidade ${intensity}/10 (${severity}) eclodiu entre ${winnerName} e ${loserName}. Após ${duration} de batalhas, ${winnerName} emergiu vitorioso, redesenhando o equilíbrio de poder na região.`,
      year: new Date().getFullYear(),
      sortOrder: 1
    }
  });

  // 3. Gerar Efeitos Dominó EXPANDIDOS baseados na ESCALA e INTENSIDADE
  const rippleEffects = [];

  // EFEITOS LOCAIS (VILLAGE/CITY)
  if (scale === "VILLAGE" || scale === "CITY") {
    // Ruínas e destruição
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "AFTERMATH", scale,
        name: `As Ruínas de ${loserName}`,
        description: `Os restos mortais de ${loserName} permanecem como um lembrete sombrio da guerra. Edifícios carbonizados, ruas destruídas e o silêncio dos que partiram.`,
        customData: { 
          status: "Devastado", 
          populacao_perdida: `${Math.floor(Math.random() * 30) + 20}%`,
          tempo_recuperacao: `${Math.floor(Math.random() * 5) + 2} anos`,
          recursos_destruidos: ["Armazéns", "Muralhas", "Templo principal"]
        },
        tags: ["Guerra", "Ruínas", "Destruição"],
        relatedIds: [loserId, mainEvent.id]
      }
    }));

    // Herói local (se intensidade alta)
    if (intensity >= 6) {
      rippleEffects.push(await prisma.loreEntry.create({
        data: {
          worldId, category: "CHARACTER", scale,
          name: `O Herói de ${winnerName}`,
          description: `Um guerreiro local surgiu das cinzas da batalha, liderando a defesa com coragem lendária. O seu nome será lembrado por gerações.`,
          customData: { 
            tipo: "Herói de Guerra",
            origem: winnerName,
            feito: "Defendeu o portão principal sozinho",
            recompensa: "Terra e título nobre"
          },
          tags: ["Herói", "Guerra", "Lenda"],
          relatedIds: [winnerId, mainEvent.id]
        }
      }));
    }

    // Tensão social (se intensidade média-alta)
    if (intensity >= 5) {
      rippleEffects.push(await prisma.loreEntry.create({
        data: {
          worldId, category: "SOCIETY", scale,
          name: "Cicatrizes na Comunidade",
          description: `Mesmo após a vitória, a comunidade de ${winnerName} carrega as cicatrizes da guerra. Famílias divididas, traumas não curados e um ódio silencioso pelos vencidos.`,
          customData: { 
            impacto_social: "Alto",
            problemas: ["PTSD coletivo", "Ódio inter-comunidade", "Escassez de mão-de-obra"],
            tempo_cura: "Uma geração"
          },
          tags: ["Sociedade", "Trauma", "Pós-Guerra"],
          relatedIds: [winnerId, mainEvent.id]
        }
      }));
    }
  }

  // EFEITOS REGIONAIS (REGION/CONTINENT)
  if (scale === "REGION" || scale === "CONTINENT") {
    // Crise de refugiados
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "EVENT", scale,
        name: `O Grande Êxodo de ${loserName}`,
        description: `Centenas de milhares fugiram da devastação, criando uma crise humanitária sem precedentes. As regiões vizinhas lutam para absorver os refugiados, gerando tensão social e escassez de recursos.`,
        customData: { 
          refugiados: `${Math.floor(Math.random() * 500) + 200} mil`,
          destino: "Regiões fronteiriças",
          impacto: "Aumento de 40% na criminalidade",
          custo_economico: "Milhões em ouro"
        },
        tags: ["Refugiados", "Crise", "Humanitário"],
        relatedIds: [loserId, mainEvent.id]
      }
    }));

    // Colapso económico
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "ECONOMY", scale,
        name: "O Colapso das Rotas Comerciais",
        description: `O comércio paralisou na região. Mercadores evitam as rotas inseguras, preços dispararam e a fome começa a aparecer nas cidades mais pobres.`,
        customData: { 
          inflacao: `+${Math.floor(Math.random() * 50) + 30}%`,
          rotas_afetadas: ["Rota do Ferro", "Caminho do Trigo", "Passagem Marítima"],
          mercadorias_escassas: ["Grãos", "Ferro", "Medicinas"],
          duracao: `${Math.floor(Math.random() * 3) + 2} anos`
        },
        tags: ["Economia", "Comércio", "Crise"],
        relatedIds: [mainEvent.id]
      }
    }));

    // Alianças políticas quebradas
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "POLITICS", scale,
        name: "O Fim das Antigas Alianças",
        description: `Os tratados de paz que mantinham a estabilidade regional foram rasgados. Reinos que antes eram aliados agora desconfiam uns dos outros, preparando-se para o próximo conflito.`,
        customData: { 
          alianças_quebradas: ["Pacto do Norte", "Tratado dos Rios"],
          novas_tensoes: "Corrida aos armamentos",
          risco_nova_guerra: "Alto"
        },
        tags: ["Política", "Alianças", "Diplomacia"],
        relatedIds: [mainEvent.id]
      }
    }));

    // Ordem militar nova (se intensidade alta)
    if (intensity >= 7) {
      rippleEffects.push(await prisma.loreEntry.create({
        data: {
          worldId, category: "ORGANIZATION", scale,
          name: `A Ordem dos ${winnerName}`,
          description: `Da necessidade nasceu uma nova ordem militar, dedicada a proteger as fronteiras e garantir que tal devastação nunca mais aconteça.`,
          customData: { 
            tipo: "Ordem Militar",
            fundador: winnerName,
            objetivo: "Defesa permanente",
            membros: `${Math.floor(Math.random() * 500) + 200} cavaleiros`
          },
          tags: ["Ordem", "Militar", "Defesa"],
          relatedIds: [winnerId, mainEvent.id]
        }
      }));
    }
  }

  // EFEITOS GLOBAIS (PLANETARY)
  if (scale === "PLANETARY") {
    // Mudança de era
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "ERA_CHANGE", scale,
        name: "O Fim de uma Era, o Início de Outra",
        description: `A vitória de ${winnerName} sobre ${loserName} não foi apenas uma batalha vencida, mas o ponto de viragem de uma era inteira. Os calendários foram resetados, as leis reescritas, e o mundo nunca mais seria o mesmo.`,
        customData: { 
          nova_era: true,
          balanco_poder: "Totalmente alterado",
          calendario: "Ano 1 da Nova Era",
          impacto_global: "Civilizações inteiras redefinidas"
        },
        tags: ["História", "Mudança Global", "Profecia Cumprida"],
        relatedIds: [winnerId, loserId, mainEvent.id]
      }
    }));

    // Profecia cumprida
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "PROPHECY", scale,
        name: "A Profecia do Fim dos Tempos",
        description: `Os antigos textos falavam de um conflito que redesenharia o mundo. Agora, com ${loserName} caído e ${winnerName} no trono, os sábios declaram: a profecia foi cumprida.`,
        customData: { 
          profecia: "Quando o último reino cair, um novo nascerá das cinzas",
          cumprimento: "Total",
          proxima_profecia: "O Retorno dos Antigos"
        },
        tags: ["Profecia", "Destino", "Místico"],
        relatedIds: [mainEvent.id]
      }
    }));

    // Mudanças climáticas/mágicas
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "PHENOMENON", scale,
        name: "As Feridas da Terra",
        description: `A magnitude do conflito deixou marcas não apenas nos homens, mas na própria terra. Tempestades mágicas, zonas mortas e anomalias climáticas surgem onde a batalha foi mais intensa.`,
        customData: { 
          fenomeno: "Tempestades arcanas",
          zonas_afetadas: "Campos de batalha principais",
          duracao: "Séculos",
          perigo: "Alto"
        },
        tags: ["Magia", "Clima", "Perigo"],
        relatedIds: [mainEvent.id]
      }
    }));

    // Novo equilíbrio de poder
    rippleEffects.push(await prisma.loreEntry.create({
      data: {
        worldId, category: "POLITICS", scale,
        name: "O Novo Ordem Mundial",
        description: `Com ${winnerName} no auge do poder, todas as nações do mundo se curvam ou preparam-se para a resistência. Uma nova era de hegemonia começou, mas a que custo?`,
        customData: { 
          hegemonia: winnerName,
          aliados: "3 grandes reinos",
          resistentes: "2 nações isoladas",
          estabilidade: "Frágil"
        },
        tags: ["Política", "Hegemonia", "Poder"],
        relatedIds: [winnerId, mainEvent.id]
      }
    }));
  }

  return {
    mainEvent,
    rippleEffects,
    summary: {
      vencedor: winnerName,
      perdedor: loserName,
      escala: scale,
      intensidade: intensity,
      severidade: severity,
      duracao: duration,
      total_efeitos: rippleEffects.length
    },
    message: `Simulação concluída! ${winnerName} venceu ${loserName}. ${rippleEffects.length} efeitos dominó foram gerados e registrados no teu mundo.`
  };
};