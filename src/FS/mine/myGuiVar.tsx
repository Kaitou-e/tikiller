class MyGuiVar {
    value: number | string | boolean | string[];

    // Overload signatures
    constructor(value: number);
    constructor(value: string);
    constructor(value: string[]);
    constructor(value: boolean);
    // Implementation signature
    constructor(value: number | string | boolean | string[]) {
        this.value = value;
    }

        // Simplified method without generics
        setValue(newValue: number | string | boolean | string[] ) {
                if (this.value === newValue) return;
                        this.value = newValue;
                                console.log("Field 'value' updated to", newValue);
                                    }
}

// Initialize with number
// const numInit = new MyClass(42);  // value = 42 [1][5]

// Initialize with string
// const strInit = new MyClass("hello");  // value = "hello" [2][6]
 
export default MyGuiVar
