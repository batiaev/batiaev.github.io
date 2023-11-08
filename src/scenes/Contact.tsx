import {Title} from "@components/Title";
import {InlineWidget} from "react-calendly";

export function Contact() {
    return (
        <section id={"contactMe"}>
            <Title text="Get In Touch"/>
            <InlineWidget url="https://calendly.com/batiaev/30min"/>
        </section>
    )
}
