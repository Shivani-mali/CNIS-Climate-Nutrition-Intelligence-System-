export const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;

    // Defined headers mapping to our data structure
    const headers = [
        'Child Name',
        'Age (months)',
        'Gender',
        'Height (cm)',
        'Weight (kg)',
        'MUAC (cm)',
        'Head Circumference (cm)',
        'Medical History (Flags)',
        'Location State',
        'Location Season',
        'Malnutrition Risk Zone',
        'Malnutrition Status',
        'Diet Recommendation',
        'Date of Record',
    ];

    // Convert data to CSV rows
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => {
            const flags = [];
            if (row.medicalHistory?.diarrhea) flags.push('Diarrhea');
            if (row.medicalHistory?.fever) flags.push('Fever');
            if (row.medicalHistory?.cough) flags.push('Cough');
            if (row.medicalHistory?.edema) flags.push('Edema');
            if (row.medicalHistory?.lethargy) flags.push('Lethargy');

            const values = [
                row.childName || 'Unknown',
                row.ageMonths || '',
                row.gender || '',
                row.heightCm || '',
                row.weightKg || '',
                row.muacCm || '',
                row.headCircCm || '',
                `"${flags.join('; ')}"`, // Quote wrapped to handle commas/semicolons safely
                row.location?.state || '',
                row.location?.season || '',
                row.result?.zone || '',
                `"${row.result?.overallStatus || ''}"`,
                `"${(row.dietRecommendation?.message || '').replace(/"/g, '""')}"`, // Escape quotes
                new Date(row.createdAt).toLocaleDateString()
            ];
            
            // Map values, handling quotes
            return values.map(v => typeof v === 'string' && !v.startsWith('"') && v.includes(',') ? `"${v}"` : v).join(',');
        })
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
