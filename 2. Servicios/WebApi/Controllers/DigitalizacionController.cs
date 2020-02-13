using Funciones.Archivos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApi.Controllers
{
    [ApiController]
    //[Authorize]
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    [RequestSizeLimit(209715200)]
    [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
    public class DigitalizacionController : ControllerBase
    {
        public DigitalizacionController()
        {

        }

        /*[System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpGet("SignHashPdf")]
        public async Task<IActionResult> SignHashPdf
            (
            ) => Ok(await ManagePdf());*/

        [System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpPost("CargarDocumentoPureBase64")]
        public async Task<IActionResult> CargarDocumentoPureBase64
            (
                [FromForm(Name = "remoteFile")] IFormFile remoteFile,
                [FromForm(Name = "createFile")] bool createFile,
                [FromForm(Name = "fileName")] string fileName
            ) => Ok(await Archivos.IFromFileToBase64(remoteFile, createFile, fileName));

        [System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpPost("CreateIFromFileToBase64Embedded")]
        public async Task<ContentResult> CreateIFromFileToBase64Embedded
            (
                [FromForm(Name = "remoteFile")] IFormFile remoteFile,
                [FromForm(Name = "fileName")] string fileName
            ) => base.Content(await Archivos.IFromFileToBase64Embedded(remoteFile, true, fileName));

        [System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpPost("IFromFileToBase64Embedded")]
        public async Task<ContentResult> IFromFileToBase64Embedded
            (
                [FromForm(Name = "remoteFile")] IFormFile remoteFile,
                [FromForm(Name = "createFile")] bool createFile,
                [FromForm(Name = "fileName")] string fileName
            ) => base.Content(await Archivos.IFromFileToBase64Embedded(remoteFile, createFile, fileName));

        [System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpPost("CargarDocumentoByteArray")]
        public async Task<IActionResult> CargarDocumentoByteArray([FromForm(Name = "remoteFile")] IFormFile remoteFile)
        {
            try
            {
                var ms = new MemoryStream();
                remoteFile.CopyTo(ms);
                var fileBytes = ms.ToArray();
                return new FileStreamResult(new MemoryStream(fileBytes), "application/pdf");
            }
            catch (Exception exce)
            {
                return BadRequest(exce.StackTrace);
            }        
        }

        [System.Web.Http.AllowAnonymous]
        [Microsoft.AspNetCore.Mvc.HttpPost("CargarDocumentoFile")]
        public async Task<IActionResult> CargarDocumentoFile([FromForm(Name = "remoteFile")] IFormFile remoteFile)
        {
            return Ok(remoteFile);
        }
    }
}
