type SvgComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>

declare module '*.svg' {
    const value: SvgComponent
    export default value
}

declare module '*.svg?import' {
    const value: string
    export default value
}
