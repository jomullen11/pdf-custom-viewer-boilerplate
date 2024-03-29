// wherever the pdf is
// let url = "../docs/Backpacking_travel.pdf";
// const url = '../docs/1565371561607-acrobat_8_help.pdf'
let url = '../docs/new-doc.pdf'



const pullDays = async () => {
    await fetch(`http://localhost:3000/users/5d5317477aadca4eef7cff07`)
    .then(res => res.json())
    .then(data => data.map(element => console.log(element.data)))

    .catch(err => console.log(err))
}



pullDays()

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        // Set Scale
        const viewport = page.getViewport({ scale })
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;

    })
};

// Check for pages rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num)
    }
}

// Show Prev Page
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    } else {
        pageNum --;
        queueRenderPage(pageNum)
    }
}

// Show Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    } else {
        pageNum++;
        queueRenderPage(pageNum)
    }
}

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector("#page-count").textContent = pdfDoc.numPages;
    renderPage(pageNum)
})
    .catch(err => {
        // Display error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message));
        document.querySelector('body').insertBefore(div, canvas);
        // Remove top bar
        document.querySelector('.top-bar').style.display = 'none'
    });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage)
document.querySelector('#next-page').addEventListener('click', showNextPage)