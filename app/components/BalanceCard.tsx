import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BalanceCardProps {
    unlockedBalance: number;
    lockedBalance: number;
}

const currency = (n: number) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const BalanceCard: React.FC<BalanceCardProps> = ({ unlockedBalance, lockedBalance }) => {
    const total = unlockedBalance + lockedBalance;
    const unlockedPct = total ? Math.round((unlockedBalance / total) * 100) : 0;

    return (
        <Card className="glass border-zinc-800">

            <CardHeader>
                <CardTitle className="text-emerald-300">Balance Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <Row label="Unlocked Balance" value={currency(unlockedBalance)} />
                <Row label="Locked Balance" value={currency(lockedBalance)} />

                <div className="pt-2">
                    <div className="flex items-center justify-between font-semibold">
                        <span>Total Balance</span>
                        <span className="text-emerald-300">{currency(total)}</span>
                    </div>

                    <div className="mt-3">
                        <Progress value={unlockedPct} />
                        <p className="mt-2 text-xs text-zinc-400">{unlockedPct}% available</p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">
            <span>{label}</span>
            <span className="text-emerald-300">{value}</span>
        </div>
    );
}

export default BalanceCard;