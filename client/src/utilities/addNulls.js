//switches empty string to null for mat update/create
export default mat => {

    mat.cost = mat.cost === "" ? null : mat.cost
    mat.gi_nogi = mat.gi_nogi === "" ? null : mat.gi_nogi
    mat.call_first = mat.call_first === "" ? null : mat.call_first
    mat.time = mat.time?.length < 6? mat.time + ":00" : mat.time

    return mat
}