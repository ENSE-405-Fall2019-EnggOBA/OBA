// retrieve all graduate attributes from graduate attributes pool
function get_all_graduate_attributes(req, res) {
    const res_body = { status: "", result: "", errors: [] };
    res_body.status = 'ok';
    res_body.result = ['knowledge base for learning','problem base analysis','life long learning'];
    return res.json(res_body);
}

// retrieve all indicators from indicators pool
function get_all_indicators(req, res) {
    const res_body = { status: "", result: "", errors: [] };
    res_body.status = 'ok';
    res_body.result = ['problem solving','thinking','some more stuff'];
    return res.json(res_body);
}

module.exports = { get_all_graduate_attributes, get_all_indicators };
