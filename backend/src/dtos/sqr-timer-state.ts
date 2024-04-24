export type SqrTimerState = 'READY' | 'START' | 'STOP' | 'PAUSE';

export const SqrTimerStateWithTitles: { [key in SqrTimerState]: string } = {
    READY: 'Создан и готов',
    START: 'Запущен',
    PAUSE: 'Приостановлен',
    STOP: 'Остановлен',
}