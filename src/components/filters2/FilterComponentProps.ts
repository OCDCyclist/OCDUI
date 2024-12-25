export interface FilterComponentProps<T> {
    value: T;
    optional?: T;
    onChange: (value: T) => void;
}