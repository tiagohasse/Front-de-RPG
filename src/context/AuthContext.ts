import type { JogadorType } from '../utils/JogadorType'
import { create } from 'zustand'

type JogadorStore = {
    jogador: JogadorType | null
    token: string | null
    setToken: (token: string | null) => void
    setJogador: (jogador: JogadorType | null) => void
    deslogaJogador: () => void
}

export const useJogadorStore = create<JogadorStore>((set) => ({
    jogador: null,
    token: null,
    setToken: (token) => set({ token }),
    setJogador: (jogador) => set({ jogador }),
    deslogaJogador: () => set({
        jogador: null,
        token: null,
    })
}))