import { Check, ChevronDown, Plus, RotateCcw } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

type Session = {
    id: string;
    name: string;
    minutes: number;
    isBreak: boolean;
};

const DEFAULT_SESSIONS: Session[] = [
    { id: 'focus', name: 'Focus', minutes: 25, isBreak: false },
    { id: 'short-break', name: 'Short break', minutes: 5, isBreak: true },
    { id: 'long-break', name: 'Long break', minutes: 15, isBreak: true },
];

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainder = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainder}`;
}

export default function Timer() {
    const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
    const [selected, setSelected] = useState(DEFAULT_SESSIONS[0]);
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [wasSaved, setWasSaved] = useState(false);
    const [modal, setModal] = useState<'closed' | 'sessions' | 'create'>('closed');
    const [name, setName] = useState('');
    const [minutesText, setMinutesText] = useState('25');
    const [error, setError] = useState('');
    const deadline = useRef<number | null>(null);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            if (deadline.current === null) return;

            const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining === 0) {
                deadline.current = null;
                setIsRunning(false);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [isRunning]);

    const duration = selected.minutes * 60;
    const elapsed = duration - secondsLeft;
    const accent = selected.isBreak ? '#E88968' : '#34765A';
    const chartData = [
        { value: Math.max(secondsLeft, 0.01), color: '#E5E9E3' },
        { value: Math.max(elapsed, 0.01), color: accent },
    ];

    function pauseTimer() {
        if (deadline.current !== null) {
            setSecondsLeft(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
        }
        deadline.current = null;
        setIsRunning(false);
    }

    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
            return;
        }
        if (secondsLeft === 0) return;

        deadline.current = Date.now() + secondsLeft * 1000;
        setIsRunning(true);
        setWasSaved(false);
    }

    function restartTimer() {
        deadline.current = null;
        setIsRunning(false);
        setSecondsLeft(duration);
        setWasSaved(false);
    }

    function chooseSession(session: Session) {
        deadline.current = null;
        setIsRunning(false);
        setSelected(session);
        setSecondsLeft(session.minutes * 60);
        setWasSaved(false);
        setModal('closed');
    }

    function createSession() {
        const sessionName = name.trim();
        const minutes = Number(minutesText);

        if (!sessionName) {
            setError('Enter a session name.');
            return;
        }
        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
            setError('Duration must be between 1 and 180 minutes.');
            return;
        }

        const session = {
            id: `custom-${sessions.length + 1}`,
            name: sessionName,
            minutes,
            isBreak: false,
        };
        setSessions((current) => [...current, session]);
        setName('');
        setMinutesText('25');
        setError('');
        chooseSession(session);
    }

    function saveTimer() {
        pauseTimer();
        setWasSaved(true);
    }

    return (
        <ScrollView className="flex-1 bg-canvas">
            <View className="flex-grow bg-canvas px-6 pb-8 pt-6">
                <View className="mb-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-[10px] font-extrabold tracking-widest text-pine">POMOFLOW / TIMER</Text>
                        <Text className="mt-1 text-2xl font-bold text-ink">Make room to focus.</Text>
                    </View>
                    <Text className="text-xs text-muted">{sessions.length} sessions</Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={() => setModal('sessions')}
                    className="min-h-[68px] flex-row items-center rounded-xl border border-line bg-white px-4"
                >
                    <View className="mr-3 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
                    <View className="flex-1">
                        <Text className="text-[9px] font-bold tracking-widest text-muted">CURRENT SESSION</Text>
                        <Text className="mt-1 text-base font-bold text-ink">{selected.name}</Text>
                    </View>
                    <Text className="mr-2 text-xs text-muted">{selected.minutes} min</Text>
                    <ChevronDown size={19} color="#202923" />
                </Pressable>

                <View className="mt-8 items-center">
                    <PieChart
                        data={chartData}
                        donut
                        radius={112}
                        innerRadius={98}
                        centerLabelComponent={() => (
                            <Text className="text-[9px] font-extrabold tracking-widest text-muted">
                                {isRunning ? 'FOCUSING' : 'TIME LEFT'}
                            </Text>
                        )}
                    />
                    <Text className="mt-2 text-[56px] font-bold text-ink">{formatTime(secondsLeft)}</Text>
                    <Text className="mt-1 text-center text-sm text-muted">
                        {secondsLeft === 0
                            ? 'Session complete'
                            : isRunning
                                ? 'Stay with one thing at a time.'
                                : `${selected.minutes} minute session`}
                    </Text>
                </View>

                <View className="mt-7 flex-row items-center gap-2.5">
                    <Pressable
                        accessibilityRole="button"
                        onPress={toggleTimer}
                        style={{ backgroundColor: accent }}
                        className="h-[52px] flex-1 items-center justify-center rounded-lg"
                    >
                        <Text className="text-[15px] font-bold text-white">
                            {isRunning ? 'Pause' : secondsLeft === 0 ? 'Finished' : 'Start'}
                        </Text>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Save timer progress"
                        onPress={saveTimer}
                        className="h-[52px] min-w-[84px] flex-row items-center justify-center gap-1.5 rounded-lg bg-pine-soft px-3"
                    >
                        <Check size={18} color="#34765A" />
                        <Text className="text-sm font-bold text-pine">{wasSaved ? 'Saved' : 'Save'}</Text>
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Restart timer"
                        onPress={restartTimer}
                        className="h-[52px] w-[52px] items-center justify-center rounded-lg border border-line bg-white"
                    >
                        <RotateCcw size={19} color="#202923" />
                    </Pressable>
                </View>
            </View>

            <Modal
                transparent
                visible={modal !== 'closed'}
                animationType="fade"
                onRequestClose={() => setModal('closed')}
            >
                <Pressable className="flex-1 items-center justify-center bg-black/40 p-5" onPress={() => setModal('closed')}>
                    <Pressable
                        className="w-full max-w-md rounded-2xl bg-canvas p-6"
                        onPress={(event) => event.stopPropagation()}
                    >
                        {modal === 'sessions' ? (
                            <>
                                <View className="mb-3 flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-[10px] font-extrabold tracking-widest text-pine">YOUR ROUTINE</Text>
                                        <Text className="mt-1 text-xl font-bold text-ink">Choose a session</Text>
                                    </View>
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityLabel="Create a session"
                                        className="h-10 w-10 items-center justify-center rounded-lg bg-pine"
                                        onPress={() => setModal('create')}
                                    >
                                        <Plus size={20} color="white" />
                                    </Pressable>
                                </View>
                                {sessions.map((session) => (
                                    <Pressable
                                        key={session.id}
                                        className="min-h-[52px] flex-row items-center border-b border-line"
                                        onPress={() => chooseSession(session)}
                                    >
                                        <View
                                            className="mr-3 h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: session.isBreak ? '#E88968' : '#34765A' }}
                                        />
                                        <Text className="flex-1 text-sm font-semibold text-ink">{session.name}</Text>
                                        <Text className="mr-3 text-xs text-muted">{session.minutes} min</Text>
                                        {session.id === selected.id && <Check size={17} color="#34765A" />}
                                    </Pressable>
                                ))}
                                <Pressable className="mt-4 flex-row items-center gap-2 py-1" onPress={() => setModal('create')}>
                                    <Plus size={16} color="#34765A" />
                                    <Text className="text-sm font-bold text-pine">Create a session</Text>
                                </Pressable>
                            </>
                        ) : (
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                <Text className="text-[10px] font-extrabold tracking-widest text-pine">PERSONALIZE YOUR ROUTINE</Text>
                                <Text className="mb-3 mt-1 text-xl font-bold text-ink">New session</Text>
                                <Text className="text-[9px] font-bold tracking-widest text-muted">SESSION NAME</Text>
                                <TextInput
                                    className="mb-4 mt-2 h-12 rounded-lg border border-line bg-white px-3 text-ink"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Reading"
                                    maxLength={30}
                                />
                                <Text className="text-[9px] font-bold tracking-widest text-muted">DURATION IN MINUTES</Text>
                                <TextInput
                                    className="mb-4 mt-2 h-12 rounded-lg border border-line bg-white px-3 text-ink"
                                    value={minutesText}
                                    onChangeText={setMinutesText}
                                    keyboardType="number-pad"
                                    maxLength={3}
                                />
                                {error ? <Text className="mb-2 text-xs text-red-700">{error}</Text> : null}
                                <View className="mt-2 flex-row gap-2.5">
                                    <Pressable
                                        className="h-[46px] flex-1 items-center justify-center rounded-lg border border-line"
                                        onPress={() => setModal('sessions')}
                                    >
                                        <Text className="text-ink">Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        className="h-[46px] flex-[1.3] items-center justify-center rounded-lg bg-pine"
                                        onPress={createSession}
                                    >
                                        <Text className="font-bold text-white">Save session</Text>
                                    </Pressable>
                                </View>
                            </KeyboardAvoidingView>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}