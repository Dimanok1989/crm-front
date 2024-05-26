import Card from "./Card";

interface Props {
    children?: React.ReactNode;
}

export default function EmptyData({ children }: Props) {
    return <Card>
        <div className="text-center py-24 text-gray-500 dark:text-slate-400">
            {children || "Данных ещё нет..."}
        </div>
    </Card>
}