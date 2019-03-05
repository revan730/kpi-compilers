func boolean validateRepo(repo r) {
    var boolean urlValid;
    urlValid = validateUrl(r.url);
    return urlValid;
}