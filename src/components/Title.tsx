type Props = {
    text: string;
};
export default function Title({text}: Props) {
    return (
        <h2 className={'default-title'}>
            {text}
        </h2>
    )
}
