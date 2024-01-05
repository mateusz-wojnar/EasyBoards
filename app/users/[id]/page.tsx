const IdPage = ({
    params,
}:{
    params: {
        id: string
    }
}) => {
    return (
        <div>
            ID: {params.id}
        </div>
    )
}

export default IdPage;