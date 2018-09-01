import { getReducerManager, getRefCountedReducerManager } from "../../Managers/ReducerManager";

interface ITestState {
    name: string;
    age: number
};

interface IExtendedTestState extends ITestState {
    city: string;
}

const reduce = (state: any, action: any) => state;

it("reducer manager tests", () => {
    const reducerManager = getReducerManager<ITestState>({
        name: reduce,
        age: reduce
    });

    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "age"]);

    reducerManager.remove("age");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name"]);

    reducerManager.remove("age");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name"]);

    reducerManager.remove("city");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name"]);

    reducerManager.add("city", reduce);
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "city"]);
});

it("ref counting reducers", () => {
    const reducerManager = getRefCountedReducerManager(getReducerManager<ITestState>({
        name: reduce,
        age: reduce
    }));

    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "age"]);

    // Increment the ref count
    reducerManager.add("age", reduce);
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "age"]);

    // Decrement the ref count
    reducerManager.remove("age");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "age"]);

    // This time it should be removed
    reducerManager.remove("age");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name"]);

    reducerManager.remove("city");
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name"]);

    reducerManager.add("city", reduce);
    expect(Object.keys(reducerManager.getReducerMap())).toEqual(["name", "city"]);
});