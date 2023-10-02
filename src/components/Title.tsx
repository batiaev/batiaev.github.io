type Props = {
    text: string;
};

export function Title({ text }: Props) {
    return (
        <h2 className="default-title">
            {text}
        </h2>
    );
}
