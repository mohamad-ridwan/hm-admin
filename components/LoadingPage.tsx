import LoadingSpinner from "./LoadingSpinner";

export default function LoadingPage(){
    return(
        <div
        className="flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 bg-bgp-default"
        >
            <LoadingSpinner/>
        </div>
    )
}