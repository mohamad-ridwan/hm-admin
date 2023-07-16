export const textToHtml = (text: string): string => {
    const elem = document.createElement('div')
    return text.split(/\n\n+/).map((paragraph) => {
        return '<p>' + paragraph.split(/\n+/).map((line) => {
            elem.textContent = line;
            return elem.innerHTML;
        }).join('<br/>') + '</p>';
    }).join('');
}