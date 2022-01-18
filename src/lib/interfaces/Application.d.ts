/**
 * @name IApplication
 */
export default interface IApplication<T> {

    /**
     * @name main
     */
    main(): void;

    /**
     * @name shutdown
     */
    shutdown(): void;
}
