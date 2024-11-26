import { io, Socket } from 'socket.io-client';
import { type LeagueData, type LeagueStorage, type RateData } from '@/interfaces';
import { reactive, ref } from 'vue';
import { store } from '@/store';
import {fetchGameHistory} from '@/services/index'
import soundOne from '@/assets/sound/sound_1.mp3'
import soundTwo from '@/assets/sound/sound_2.mp3'
import soundThree from '@/assets/sound/sound_3.mp3'

export const leagueStorage: LeagueStorage = reactive({
    'IPBL Pro Division': { value: {}, maxLength: 100 },
    'IPBL Pro Division Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League': { value: {}, maxLength: 100 },
});

export const getColor = (
    item: string | undefined,
): string | undefined => {
    if (!item) return
    const itemBuff = +item
    if (itemBuff <= 1.73 && itemBuff >= 1.69) {
        return '#FAFF00'; // Желтый
    }
    else if (itemBuff <= 1.68 && itemBuff >= 1.64) {
        return '#FF8A00'; // Оранжевый
    }
    else if (itemBuff <= 1.63 && itemBuff > 1.59) {
        return '#FF0000'; // Красный
    }
    else if (itemBuff <= 1.59) {
        return '#9E00FF'; // Фиолетовый
    } else {
        return
    }
}

let audio: HTMLAudioElement | null;

const playSound = (color: string) => {
    switch (color) {
        case '#FF0000': // Red
            audio = new Audio(soundOne);
            break;
        case '#9E00FF': // Purple
            audio = new Audio(soundTwo);
            break;
        case '#FF8A00': // Orange
            audio = new Audio(soundThree);
            break;
        default:
            audio = null;
    }

    if (audio) {
        audio.play();
    }
};

const addToHistory = (rate: RateData, name: string, matchKey: string) => {
    let highestPriorityColor: string | null = null;

    for (const key in rate) {
        if (key === 'server_time' || key === 'total_point' || key === 'handicap_point_0' || key === 'handicap_point_1') continue;
        if (Object.prototype.hasOwnProperty.call(rate, key)) {
            const element = rate[key];
            const color = element ? getColor(element) : '';

            if (color) {
                store.dispatch('matchColorHistory/setMatchColorHistory', {
                    league: name,
                    key: matchKey,
                    color,
                });

                if (!highestPriorityColor || getPriority(color) > getPriority(highestPriorityColor)) {
                    highestPriorityColor = color;
                }
            }
        }
    }

    if (highestPriorityColor) {
        playSound(highestPriorityColor);
    }
};

const getPriority = (color: string): number => {
    switch (color) {
        case '#9E00FF': // Red
            return 3;
        case '#FF0000': // Purple
            return 2;
        case '#FF8A00': // Orange
            return 1;
        default:
            return 0;
    }
};

const sortByTime=(data: LeagueData[]) =>{
    return data.sort((a, b) => {
        const timeA = a.server_time.split(':').map(Number);
        const timeB = b.server_time.split(':').map(Number);

        const timestampA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2];
        const timestampB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2];

        return timestampB-timestampA ;
    });
}

const addToLeague =async (name: string, data: LeagueData[], site: string) => {
    try {
        const league = leagueStorage[name];

        if (!league || !league.value) {
            console.error(`Лига ${name} не найдена или не имеет значения`);
            return;
        }

        data.forEach(async (match) => {
            const matchKey = `${match.opponent_0}-${match.opponent_1}`;
            if (match.opponent_0 !== ' ' && match.opponent_1 !== ' ') {
                if (match.is_end_game) {
                    if (league.value[matchKey]) {
                        delete league.value[matchKey];
                        store.dispatch('matchColorHistory/removeMatchColorHistory', {
                            league: name,
                            key: matchKey,
                        });
                    }
                } else {
                    const newEntry = { ...match, site };
                    const buffer = league.value[matchKey] || [];
                    league.value[matchKey] = [newEntry, ...buffer];

                    // if (league.value[matchKey].length > league.maxLength) {
                    //     league.value[matchKey].length = league.maxLength;
                    // }

                    if(match.rate){
                        addToHistory(match.rate, name, matchKey);
                    }

                    if (league.value[matchKey].length < 2) {

                        const timeParts = match.time_game.split(' ')[1]; 
                        const [minutes] = timeParts.split(':').map(Number); 

                        if(timeParts[0] !=='I' || (timeParts[0] =='I' && minutes<11)){

                            const historyGame = await fetchGameHistory(name, matchKey)
                            
                            league.value[matchKey] = [ ...league.value[matchKey],...historyGame]
                
                            league.value[matchKey] = sortByTime(league.value[matchKey])
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error(`Ошибка при обновлении ${name}:`, error);
    }
};

export const useSocket = (URL: string) => {
    const socket = ref<Socket | null>(null);

    const openSocket = () => {
        socket.value = io(URL, {
            transports: ['websocket', 'polling', 'flashsocket'], 
            auth: {
                socket_key: '1951a1a5-e017-4299-be60-022e52a0d099',
              }
        });

        socket.value.on('connect', () => {
            console.log('Соединение установлено');
        });

        socket.value.on('disconnect', () => {
            console.log('Соединение разорвано');
        });

        socket.value.on('message', (data: string) => {       
            try {
                if (data) {
                    const parsedData = JSON.parse(data);
                    parsedData['akty.com'] ? processLeagueData(parsedData, 'akty.com') : processLeagueData(parsedData, 'fb.com');
                    
                }
            } catch (error) {
                console.error('Ошибка при обработке сообщения сокета:', error);
            }
        })
        socket.value.on('error', (error: any) => {
            console.error('Ошибка сокета:', error);
        });
    };

    const closeSocket = () => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    };

    return {
        openSocket,
        closeSocket,
    };
};

const processLeagueData = (data: any, site: string) => {
    try {
        for (const key in data[site]) {
            if (leagueStorage[key]) {
                addToLeague(key, data[site][key], site);
            }
        }
    } catch (error) {
        console.error('Ошибка при обработке данных лиги:', error);
    }
};
